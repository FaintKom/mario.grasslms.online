/*
 * Desktop-only notice for the simulations (mini-cases, mini-OS, SCORM modules).
 * Their layouts recreate desktop apps and are not usable below ~900 px, so on
 * narrow screens this covers the page with a screenshot and three ways out:
 * copy the link, go back to the portfolio, or try anyway.
 *
 * Include with:
 *   <script src="../_shared/desktop-only.js" data-shot="shots/case-a.jpg"
 *           data-back="../../" defer></script>
 * data-shot and data-back are resolved against the page URL. Optional
 * data-back-label renames the back link (default "Back to portfolio").
 */
(function () {
  var script = document.currentScript;
  var mq = window.matchMedia("(max-width: 899px)");
  var KEY = "desktop-only-dismissed";

  function dismissed() {
    try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }

  function build() {
    if (!mq.matches || dismissed() || document.getElementById("desktop-only")) return;
    var shot = script && script.dataset.shot;
    var back = (script && script.dataset.back) || "/";
    var backLabel = (script && script.dataset.backLabel) || "Back to portfolio";

    var css = document.createElement("style");
    css.textContent =
      "#desktop-only{position:fixed;inset:0;z-index:2147483000;overflow:auto;background:#fafbf6;color:#0a1a10;" +
      "font:15px/1.55 Manrope,system-ui,-apple-system,'Segoe UI',sans-serif;padding:max(24px,env(safe-area-inset-top)) 20px max(24px,env(safe-area-inset-bottom))}" +
      "#desktop-only .do-in{max-width:560px;margin:0 auto;display:grid;gap:18px}" +
      "#desktop-only .do-k{font:500 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:#5f6e64}" +
      "#desktop-only h1{font-size:26px;line-height:1.15;font-weight:800;letter-spacing:-.01em;margin:0}" +
      "#desktop-only p{margin:0;color:#4d5a51}" +
      "#desktop-only img{display:block;width:100%;height:auto;border:1px solid #e3e6e0;border-radius:10px}" +
      "#desktop-only .do-a{display:grid;gap:10px}" +
      "#desktop-only button,#desktop-only a{display:block;text-align:center;font-family:inherit;font-weight:600;font-size:15px;line-height:1.2;padding:14px 16px;border-radius:10px;text-decoration:none;cursor:pointer}" +
      "#desktop-only .do-p{background:#0a8754;color:#fff;border:0}" +
      "#desktop-only .do-s{background:#fff;color:#0a1a10;border:1px solid #cfd4cd}" +
      "#desktop-only .do-t{background:none;border:0;color:#4d5a51;text-decoration:underline;font-weight:500}" +
      "#desktop-only :focus-visible{outline:2px solid #0a8754;outline-offset:2px}" +
      "#desktop-only h1:focus{outline:none}";
    document.head.appendChild(css);

    var box = document.createElement("div");
    box.id = "desktop-only";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-labelledby", "desktop-only-h");
    box.innerHTML =
      '<div class="do-in">' +
        '<div class="do-k">Desktop simulation</div>' +
        '<h1 id="desktop-only-h" tabindex="-1">Open this on a computer</h1>' +
        "<p>This simulation recreates a desktop workspace and needs a screen at least 900 px wide. Here is what it looks like.</p>" +
        (shot ? '<img alt="Screenshot of the simulation on a desktop screen" src="' + new URL(shot, location.href).href + '">' : "") +
        '<div class="do-a">' +
          '<button type="button" class="do-p" data-do="copy">Copy link</button>' +
          '<a class="do-s" href="' + new URL(back, location.href).href + '">' + backLabel + '</a>' +
          '<button type="button" class="do-t" data-do="stay">Try it here anyway</button>' +
        "</div>" +
      "</div>";
    document.body.appendChild(box);
    document.documentElement.style.overflow = "hidden";

    box.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-do]") : null;
      if (!t) return;
      if (t.dataset.do === "stay") {
        try { sessionStorage.setItem(KEY, "1"); } catch (err) {}
        document.documentElement.style.overflow = "";
        box.remove();
      } else if (t.dataset.do === "copy") {
        var done = function () { t.textContent = "Link copied"; };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(location.href).then(done, function () { t.textContent = location.href; });
        } else {
          t.textContent = location.href;
        }
      }
    });
    var h = document.getElementById("desktop-only-h");
    if (h) h.focus();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
  if (mq.addEventListener) mq.addEventListener("change", build);
})();
