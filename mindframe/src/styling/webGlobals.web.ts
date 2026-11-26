// src/styling/webGlobals.web.ts
import { colors } from "./theme";

const CSS = `
  html, body, #root { height: 100%; }
  @supports (height: 100dvh) { html, body, #root { height: 100dvh; } }

  body {
    margin: 0;
    background: ${colors.surfaceSunken};
    color-scheme: dark;              /* dark scrollbars + native date/time pickers */
    overscroll-behavior: none;       /* no rubber-band bounce revealing the page */
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;
    user-select: none;               /* app chrome shouldn't be text-selectable */
  }
  input, textarea { user-select: text; }

  * { scrollbar-width: none; }       /* hide scrollbars, scrolling still works */
  *::-webkit-scrollbar { display: none; }

  /* Keyboard users still get a focus ring, in the brand color. */
  *:focus { outline: none; }
  *:focus-visible { outline: 2px solid ${colors.brand}; outline-offset: 2px; }
`;

export function installWebGlobals(): void {
  if (document.getElementById("mindframe-globals")) return;
  const style = document.createElement("style");
  style.id = "mindframe-globals";
  style.textContent = CSS;
  document.head.appendChild(style);
}
