#!/usr/bin/env python3
"""
Build a single SCORM 1.2 .zip package containing:
- scorm-shell/ (window manager, app registry, 7 simulated apps)
- module-01-diagnostic-opener/
- module-02-objection-acknowledge/
- module-03-calendar-close/

Synthesizes a root imsmanifest.xml with three <organization> entries so an
LMS (Moodle, SCORM Cloud, Sana, etc.) can pick any of the 3 modules as the
launch SCO, or run them as a package.

Output: dist/FTC-SDR-Onboarding-M1-M2-M3-scorm12.zip

Usage:
    python _build-scorm-package.py
"""

import os
import shutil
import zipfile
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).parent
DIST = ROOT / "dist"
PACKAGE = DIST / "package"

MODULES = [
    { "id": "FTC-SDR-M1", "dir": "module-01-diagnostic-opener",     "title": "Module 1 · M1 Diagnostic Opener",      "launch": "module-01-diagnostic-opener/index.html",     "mastery": 67 },
    { "id": "FTC-SDR-M2", "dir": "module-02-objection-acknowledge", "title": "Module 2 · M2 Objection Acknowledge",  "launch": "module-02-objection-acknowledge/index.html", "mastery": 67 },
    { "id": "FTC-SDR-M3", "dir": "module-03-calendar-close",        "title": "Module 3 · M3 Calendar Close",         "launch": "module-03-calendar-close/index.html",        "mastery": 67 },
    { "id": "FTC-SDR-M4", "dir": "module-04-icp-buyer-fit",         "title": "Module 4 · M4 ICP Buyer Fit",          "launch": "module-04-icp-buyer-fit/index.html",         "mastery": 67 },
    { "id": "FTC-SDR-M5", "dir": "module-05-product-prop-mapping",  "title": "Module 5 · M5 Product-Prop Mapping",   "launch": "module-05-product-prop-mapping/index.html",  "mastery": 67 },
    { "id": "FTC-SDR-M6", "dir": "module-06-regulatory-deflection", "title": "Module 6 · M6 Regulatory Deflection",  "launch": "module-06-regulatory-deflection/index.html", "mastery": 67 },
]

SHELL_DIR = "scorm-shell"


def collect_files(root):
    files = []
    for p in root.rglob("*"):
        if p.is_file():
            files.append(p.relative_to(root).as_posix())
    files.sort()
    return files


def build_resource_block(res_id, launch_href, file_paths):
    files_xml = "\n".join(f'      <file href="{f}"/>' for f in file_paths)
    return f"""    <resource identifier="{res_id}" type="webcontent" adlcp:scormtype="sco" href="{launch_href}">
{files_xml}
    </resource>"""


def build_item_block(mod):
    return f"""    <item identifier="{mod['id']}-ITEM" identifierref="{mod['id']}-RES" isvisible="true">
      <title>{mod['title']}</title>
      <adlcp:masteryscore>{mod['mastery']}</adlcp:masteryscore>
      <adlcp:maxtimeallowed>PT0H10M0S</adlcp:maxtimeallowed>
    </item>"""


def synth_root_manifest(modules, shell_files, module_files):
    organizations_xml = []
    for mod in modules:
        organizations_xml.append(f"""    <organization identifier="{mod['id']}-ORG">
      <title>{mod['title']}</title>
{build_item_block(mod)}
    </organization>""")

    resources_xml = []
    for mod in modules:
        files_for_mod = list(module_files[mod['id']]) + shell_files
        resources_xml.append(build_resource_block(mod['id'] + "-RES", mod['launch'], files_for_mod))

    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<!--
  FinTechCard SDR Onboarding · combined SCORM 1.2 package
  Built: {timestamp}
  Source: pipeline/engagement/03-develop/_build-scorm-package.py

  Contains all 3 keystone-move modules (M1 Diagnostic Opener · M2 Objection
  Acknowledge · M3 Calendar Close) plus the shared scorm-shell. Any LMS
  (Moodle, SCORM Cloud, Sana, etc.) can launch any module as a separate SCO.

  Schema: ADL SCORM 1.2 (CAM 1.3 compatible)
-->
<manifest identifier="FTC.SDR.Onboarding.combined.v1"
          version="1.0"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">

  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>

  <organizations default="FTC-SDR-M3-ORG">
{chr(10).join(organizations_xml)}
  </organizations>

  <resources>
{chr(10).join(resources_xml)}
  </resources>
</manifest>
"""


def main():
    if PACKAGE.exists():
        shutil.rmtree(PACKAGE)
    PACKAGE.mkdir(parents=True, exist_ok=True)

    print(f"[scorm-pkg] copying shell + 3 modules -> {PACKAGE}")
    shutil.copytree(ROOT / SHELL_DIR, PACKAGE / SHELL_DIR)
    module_files = {}
    for mod in MODULES:
        shutil.copytree(ROOT / mod["dir"], PACKAGE / mod["dir"])
        module_files[mod["id"]] = [f"{mod['dir']}/{p}" for p in collect_files(PACKAGE / mod["dir"])]

    shell_files = [f"{SHELL_DIR}/{p}" for p in collect_files(PACKAGE / SHELL_DIR)]

    manifest = synth_root_manifest(MODULES, shell_files, module_files)
    (PACKAGE / "imsmanifest.xml").write_text(manifest, encoding="utf-8")
    print(f"[scorm-pkg] wrote root manifest ({len(manifest)} bytes)")

    zip_path = DIST / "FTC-SDR-Onboarding-M1-M6-scorm12.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for p in sorted(PACKAGE.rglob("*")):
            if p.is_file():
                arcname = p.relative_to(PACKAGE).as_posix()
                zf.write(p, arcname)
    size_kb = zip_path.stat().st_size / 1024
    print(f"[scorm-pkg] wrote {zip_path.name} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
