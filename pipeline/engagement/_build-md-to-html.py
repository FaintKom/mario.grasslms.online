#!/usr/bin/env python3
"""
Convert every .md inside pipeline/engagement/ to a sibling .html
wrapped in a Lively-styled HTML shell. Then rewrite all <a href="*.md">
references inside engagement HTML files to point to the .html equivalents.

Idempotent: re-running regenerates .html files in place.
"""
import os, re, sys, pathlib, markdown

ROOT = pathlib.Path(__file__).parent.resolve()

SHELL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>{title} — FinTechCard Engagement · Mario Becerra</title>
<meta name="description" content="{desc}"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<style>
:root {{
  --bg: #fafbf6; --paper: #ffffff;
  --ink-900: #0a1a10; --ink-700: #1a2a1f; --ink-500: #4d5a51; --ink-400: #6b7a70;
  --ink-200: #c9cec9; --ink-100: #e6e8e4; --ink-50: #f4f5f1;
  --green-700: #07683f; --green-600: #0a8754; --green-300: #8fd770; --green-50: #ecf9e7;
  --sun-500: #f5b800; --sun-50: #fffbe5;
  --coral-700: #c33d22; --coral-500: #ff7a5c; --coral-50: #fff0eb;
  --mono: "Geist Mono", ui-monospace, Menlo, monospace;
  --sans: "Manrope", ui-sans-serif, system-ui, sans-serif;
}}
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; padding: 0; background: var(--bg); }}
body {{
  font-family: var(--sans);
  color: var(--ink-900);
  font-size: 15px; line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}}
.topbar {{
  background: var(--ink-900); color: var(--paper);
  padding: 10px 24px;
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 10px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
  position: sticky; top: 0; z-index: 40;
}}
.topbar .brand {{ display: flex; align-items: center; gap: 10px; color: var(--paper); }}
.topbar .brand .mark {{
  width: 22px; height: 22px; border-radius: 6px; background: var(--green-600);
  display: inline-flex; align-items: center; justify-content: center;
  font-weight: 800; font-family: var(--sans); font-size: 13px; color: #fff;
}}
.topbar .actions {{ display: flex; gap: 6px; flex-wrap: wrap; }}
.topbar .btn {{
  background: transparent; color: var(--paper);
  border: 1px solid rgba(255,255,255,0.2); border-radius: 4px;
  padding: 4px 10px; font: inherit; cursor: pointer; text-decoration: none;
}}
.topbar .btn:hover {{ background: rgba(255,255,255,0.08); }}

main.sheet {{
  max-width: 880px; margin: 32px auto; padding: 40px 56px;
  background: var(--paper);
  border: 1px solid var(--ink-100);
  border-radius: 8px;
  box-shadow: 0 4px 24px -12px rgba(0,0,0,0.08);
}}
@media (max-width: 720px) {{
  main.sheet {{ margin: 16px auto; padding: 24px 18px; border-radius: 0; }}
}}

main.sheet h1, main.sheet h2, main.sheet h3, main.sheet h4, main.sheet h5 {{
  font-family: var(--sans); color: var(--ink-900);
  font-weight: 700; letter-spacing: -0.005em;
  margin: 1.6em 0 0.5em;
}}
main.sheet h1 {{ font-size: 32px; line-height: 1.15; margin-top: 0; padding-bottom: 14px; border-bottom: 2px solid var(--green-600); }}
main.sheet h2 {{ font-size: 23px; border-top: 1px solid var(--ink-100); padding-top: 22px; }}
main.sheet h2:first-of-type {{ border-top: none; padding-top: 0; }}
main.sheet h3 {{ font-size: 18px; color: var(--green-700); }}
main.sheet h4 {{ font-size: 16px; }}
main.sheet h5 {{ font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-500); }}

main.sheet p {{ margin: 0.8em 0; }}
main.sheet a {{ color: var(--green-700); text-decoration: underline; text-underline-offset: 2px; }}
main.sheet a:hover {{ color: var(--green-600); }}
main.sheet strong {{ color: var(--ink-900); font-weight: 700; }}
main.sheet em {{ color: var(--ink-700); }}

main.sheet ul, main.sheet ol {{ margin: 0.6em 0; padding-left: 24px; }}
main.sheet li {{ margin: 0.3em 0; }}
main.sheet li > p {{ margin: 0.3em 0; }}

main.sheet hr {{ border: none; border-top: 1px solid var(--ink-100); margin: 32px 0; }}

main.sheet blockquote {{
  margin: 1em 0; padding: 10px 18px;
  background: var(--sun-50); border-left: 3px solid var(--sun-500);
  border-radius: 0 6px 6px 0;
  font-style: italic; color: var(--ink-700);
}}
main.sheet blockquote p {{ margin: 0.4em 0; }}

main.sheet code {{
  font-family: var(--mono); font-size: 0.88em;
  background: var(--ink-50); padding: 1px 6px; border-radius: 3px;
  color: var(--coral-700);
}}
main.sheet pre {{
  background: var(--ink-50); padding: 14px 18px;
  border-left: 3px solid var(--green-600); border-radius: 0 6px 6px 0;
  overflow-x: auto; font-size: 12.5px; line-height: 1.5;
  margin: 1em 0;
}}
main.sheet pre code {{
  background: none; padding: 0; color: var(--ink-900);
}}

main.sheet table {{
  width: 100%; border-collapse: collapse; margin: 1em 0;
  font-size: 13.5px;
}}
main.sheet thead th {{
  background: var(--ink-50); color: var(--ink-700);
  text-align: left; padding: 10px 12px;
  border-bottom: 2px solid var(--ink-200);
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase;
}}
main.sheet tbody td {{
  padding: 10px 12px; border-bottom: 1px solid var(--ink-100);
  vertical-align: top; line-height: 1.5;
}}
main.sheet tbody tr:nth-child(even) td {{ background: var(--ink-50); }}

footer.foot {{
  max-width: 880px; margin: 16px auto 40px; padding: 0 56px;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.05em;
  color: var(--ink-400); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;
}}
footer.foot a {{ color: var(--green-700); }}
@media (max-width: 720px) {{
  footer.foot {{ padding: 0 18px; }}
}}
</style>
</head>
<body>

<div class="topbar">
  <div class="brand">
    <div class="mark">m</div>
    <span>{breadcrumb}</span>
  </div>
  <div class="actions">
    <a class="btn" href="{root_rel}../../">← Portfolio</a>
    <a class="btn" href="{root_rel}../">← Pipeline</a>
    <a class="btn" href="{root_rel}">← Engagement</a>
  </div>
</div>

<main class="sheet">
{body}
</main>

<footer class="foot">
  <span>Mario Becerra · FinTechCard engagement · {breadcrumb}</span>
  <span>v1.0</span>
</footer>

</body>
</html>
"""

MD_EXTS = ['extra', 'tables', 'fenced_code', 'sane_lists', 'toc']

def first_h1(md_text: str) -> str:
    m = re.search(r'^#\s+(.+)$', md_text, re.M)
    return m.group(1).strip() if m else ''

def md_path_to_title(p: pathlib.Path) -> str:
    return p.stem.replace('-', ' ').replace('_', ' ').title()

def first_para(html: str) -> str:
    m = re.search(r'<p>(.+?)</p>', html, re.S)
    if not m: return ""
    raw = re.sub(r'<[^>]+>', '', m.group(1))
    return raw.replace('"', '&quot;').strip()[:200]

def compute_root_rel(md_path: pathlib.Path) -> str:
    rel = md_path.parent.relative_to(ROOT)
    if str(rel) == '.': return ''
    depth = len(rel.parts)
    return '../' * depth

def convert_one(md_path: pathlib.Path):
    text = md_path.read_text(encoding='utf-8')
    body = markdown.markdown(text, extensions=MD_EXTS)
    title = first_h1(text) or md_path_to_title(md_path)
    desc = first_para(body) or f"{title} · FinTechCard SDR Onboarding"
    rel_parent = md_path.parent.relative_to(ROOT)
    breadcrumb = f"{rel_parent}/{md_path.name}" if str(rel_parent) != '.' else md_path.name
    root_rel = compute_root_rel(md_path)
    file_basename = md_path.stem
    out = SHELL.format(
        title=title.replace('<', '&lt;').replace('>', '&gt;'),
        desc=desc,
        breadcrumb=breadcrumb,
        root_rel=root_rel,
        file_basename=file_basename,
        body=body,
    )
    out_path = md_path.with_suffix('.html')
    out_path.write_text(out, encoding='utf-8')
    return out_path

def rewrite_md_links_in_html(html_path: pathlib.Path):
    text = html_path.read_text(encoding='utf-8')
    new = re.sub(
        r'href="((?:\./|\.\./)?[^"#\s]+?)\.md(#[^"]*)?"',
        lambda m: f'href="{m.group(1)}.html{m.group(2) or ""}"',
        text
    )
    if new != text:
        html_path.write_text(new, encoding='utf-8')
        return True
    return False

def main():
    md_files = sorted(ROOT.rglob('*.md'))
    print(f"Converting {len(md_files)} .md to .html ...")
    for p in md_files:
        out = convert_one(p)
        print(f"  {p.relative_to(ROOT)} -> {out.name}")
    # Rewrite .md → .html in ALL HTML files (hand-authored + generated)
    all_html = sorted(ROOT.rglob('*.html'))
    print(f"\nRewriting .md links in {len(all_html)} HTML files ...")
    rewritten = 0
    for h in all_html:
        if rewrite_md_links_in_html(h):
            rewritten += 1
    print(f"  {rewritten} files updated.")
    print("Done.")

if __name__ == '__main__':
    main()
