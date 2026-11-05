export type Theme = "dark" | "light";

/** Key used by both the pre-paint bootstrap script and the toggle. */
export const THEME_STORAGE_KEY = "pn-theme";

export const THEME_COLORS: Record<Theme, string> = {
  dark: "#08090d",
  light: "#f6f6f9",
};

/**
 * Runs before the first paint so the page never flashes the wrong palette.
 * It only touches `data-theme` and the theme-color meta tag; the palette itself
 * lives in CSS custom properties, so no component needs to know about this.
 */
export const THEME_BOOTSTRAP = `(function(){
try{
var k="${THEME_STORAGE_KEY}";
var s=localStorage.getItem(k);
var t=(s==="light"||s==="dark")?s:(window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");
var r=document.documentElement;
r.setAttribute("data-theme",t);
var m=document.querySelector('meta[name="theme-color"]');
if(!m){m=document.createElement("meta");m.setAttribute("name","theme-color");document.head.appendChild(m);}
m.setAttribute("content",t==="light"?"${THEME_COLORS.light}":"${THEME_COLORS.dark}");
}catch(e){document.documentElement.setAttribute("data-theme","dark")}
})();`;

/** Shared by the toggle and any future control. */
export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* private mode / storage disabled — the session still switches */
  }
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", THEME_COLORS[theme]);
}
