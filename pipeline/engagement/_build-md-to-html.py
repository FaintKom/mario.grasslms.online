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
  --ink: #0a1a10; --ink-dim: #4d5a51; --ink-faint: #6b7a70;
  --ink-200: #c9cec9; --ink-100: #e6e8e4; --ink-50: #f4f5f1;
  --rule: #e6e8e4;
  --accent: #0a8754; --green-700: #07683f; --green-300: #8fd770; --green-50: #ecf9e7;
  --sun-300: #ffe066; --sun-500: #f5b800; --sun-50: #fffbe5;
  --coral-700: #c33d22; --coral-500: #ff7a5c; --coral-50: #fff0eb;
  --mono: "Geist Mono", ui-monospace, Menlo, monospace;
  --sans: "Manrope", ui-sans-serif, system-ui, sans-serif;
}}
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; padding: 0; background: var(--bg); }}
body {{
  font-family: var(--sans);
  color: var(--ink);
  font-size: 15px; line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}}

/* Cream topbar (Mario portfolio style — NOT dark navy) */
.topbar {{
  background: var(--bg); color: var(--ink);
  padding: 12px 24px;
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 16px;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
  position: sticky; top: 0; z-index: 40;
  border-bottom: 1px solid var(--rule);
}}
.topbar .brand {{ display: flex; align-items: center; gap: 12px; color: var(--ink-dim); }}
.topbar .brand .mark {{
  font-family: var(--mono); font-weight: 700; color: var(--accent); font-size: 12px;
}}
.topbar .brand .crumb {{ color: var(--ink-faint); }}
.topbar .actions {{ display: flex; gap: 16px; flex-wrap: wrap; }}
.topbar .nav-link {{
  background: transparent; color: var(--ink-dim);
  border: none; text-decoration: none;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase;
  border-bottom: 1px solid transparent;
}}
.topbar .nav-link:hover {{ color: var(--accent); border-bottom-color: var(--accent); }}

main.sheet {{
  max-width: 820px; margin: 40px auto 24px; padding: 0 32px;
}}
@media (max-width: 720px) {{
  main.sheet {{ margin: 24px auto; padding: 0 18px; }}
}}

/* Lively signature: Manrope 800 H1 with rotated sun-300 highlight */
main.sheet h1 {{
  font-family: var(--sans);
  font-weight: 800;
  font-size: clamp(34px, 5.2vw, 52px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin: 0 0 8px;
}}
main.sheet h1 em {{
  font-style: normal;
  background: var(--sun-300);
  padding: 0 10px;
  border-radius: 8px;
  display: inline-block;
  transform: rotate(-1deg);
  color: var(--ink);
}}
main.sheet h1::after {{
  content: "";
  display: block;
  width: 64px; height: 2px;
  background: var(--accent);
  margin-top: 18px;
}}

/* H2 (manual section numbers preserved from author's markdown) */
main.sheet h2 {{
  font-family: var(--sans); color: var(--ink);
  font-weight: 800; letter-spacing: -0.015em;
  font-size: 26px; line-height: 1.2;
  margin: 56px 0 14px;
  padding-top: 28px;
  border-top: 1px solid var(--rule);
}}
main.sheet h2:first-of-type {{ border-top: none; padding-top: 0; margin-top: 36px; }}

main.sheet h3 {{
  font-family: var(--sans); color: var(--ink);
  font-weight: 800; font-size: 17px; line-height: 1.3;
  margin: 28px 0 8px; letter-spacing: -0.01em;
}}
main.sheet h4 {{
  font-family: var(--mono); color: var(--green-700);
  font-weight: 700; font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.08em;
  margin: 24px 0 8px;
}}
main.sheet h5 {{
  font-family: var(--mono); font-size: 11px; text-transform: uppercase;
  letter-spacing: 0.06em; color: var(--ink-faint); margin: 20px 0 6px;
}}

main.sheet p {{ margin: 0.8em 0; }}
main.sheet a {{
  color: var(--green-700); text-decoration: none;
  border-bottom: 1px solid currentColor;
  transition: color 0.15s ease, border-color 0.15s ease;
}}
main.sheet a:hover {{ color: var(--accent); border-bottom-color: var(--accent); }}
main.sheet strong {{ color: var(--ink); font-weight: 700; }}
main.sheet em {{ color: var(--ink-dim); font-style: italic; }}

main.sheet ul, main.sheet ol {{ margin: 0.6em 0; padding-left: 24px; }}
main.sheet li {{ margin: 0.3em 0; }}
main.sheet li > p {{ margin: 0.3em 0; }}

main.sheet hr {{
  border: none; border-top: 1px solid var(--rule);
  margin: 40px 0;
}}

main.sheet blockquote {{
  margin: 1.2em 0; padding: 14px 20px;
  background: var(--green-50); border-left: 3px solid var(--accent);
  border-radius: 0;
  color: var(--ink-700); font-size: 15px; line-height: 1.55;
}}
main.sheet blockquote p {{ margin: 0.4em 0; }}
main.sheet blockquote cite {{
  display: block;
  font-family: var(--mono); font-style: normal;
  font-size: 11px; color: var(--ink-faint);
  text-transform: uppercase; letter-spacing: 0.05em;
  margin-top: 10px;
}}

main.sheet code {{
  font-family: var(--mono); font-size: 0.88em;
  background: var(--ink-50); padding: 1px 6px; border-radius: 3px;
  color: var(--green-700);
}}
main.sheet pre {{
  background: var(--ink-50); padding: 16px 20px;
  border-left: 3px solid var(--accent);
  overflow-x: auto; font-size: 12.5px; line-height: 1.55;
  margin: 1.2em 0;
}}
main.sheet pre code {{
  background: none; padding: 0; color: var(--ink);
}}

main.sheet table {{
  width: 100%; border-collapse: collapse; margin: 1.2em 0;
  font-size: 13.5px;
  border-top: 1px solid var(--rule);
}}
main.sheet thead th {{
  background: var(--ink-50); color: var(--ink-dim);
  text-align: left; padding: 12px 14px;
  border-bottom: 1px solid var(--rule);
  font-family: var(--mono); font-size: 10px;
  letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700;
}}
main.sheet tbody td {{
  padding: 12px 14px; border-bottom: 1px solid var(--rule);
  vertical-align: top; line-height: 1.5;
}}

footer.foot {{
  max-width: 820px; margin: 32px auto 48px; padding: 24px 32px 0;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.06em;
  color: var(--ink-faint); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  border-top: 1px solid var(--rule);
  text-transform: uppercase;
}}
footer.foot a {{ color: var(--green-700); text-decoration: none; border-bottom: 1px solid currentColor; }}
footer.foot a:hover {{ color: var(--accent); }}
@media (max-width: 720px) {{
  footer.foot {{ padding: 24px 18px 0; }}
}}
</style>
</head>
<body>

<div class="topbar">
  <div class="brand">
    <span class="mark">M·</span>
    <span class="crumb">{breadcrumb}</span>
  </div>
  <div class="actions">
    <a class="nav-link" href="{root_rel}../../">← Portfolio</a>
    <a class="nav-link" href="{root_rel}../">← Pipeline</a>
    <a class="nav-link" href="{root_rel}">← Engagement</a>
  </div>
</div>

<main class="sheet">
{body}
</main>

<footer class="foot">
  <span>Built by <strong style="color:var(--ink-dim);">Mario Becerra</strong> · pipeline/engagement/{breadcrumb}</span>
  <span><a href="{root_rel}../../">mario.grasslms.online</a></span>
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
