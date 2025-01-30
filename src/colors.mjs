// I could use a library here. Maybe I should. But I want to do it myself for now.
// I have never seen the unhandled values in the wild so I am gonna ignore them for now to save a unnecessary dep.

/**
 * hex
 * https://developer.mozilla.org/en-US/docs/Web/CSS/hex-color#syntax
 *
 * Handled:
 * #aaa | #aaaa | #aaaaaa | #aaaaaaaa
 */
const hexRegex = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/;

/**
 * rgb / rgba
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb#syntax
 * The rgba() functional notation is an alias for rgb(). They are exactly equivalent. It is recommended to use rgb().
 *
 * Handled:
 * rgb(255 255 255) | rgb(255 255 255 / 50%) | rgb(255 255 255 / 0.5) | rgb(0, 255, 255) | rgb(0, 255, 255, 50%) | rgb(0, 255, 255, 0.5)
 * or all w/ rgba(...)
 *
 * @todo Unhandled
 * any relative values
 */
const rgbRegex = /^rgba?\(\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i;

/**
 * hsl / hsla
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl#syntax
 * The hsla() functional notation is an alias for hsl(). They are exactly equivalent. It is recommended to use hsl().
 *
 * Handled:
 * hsl(120deg 75% 25%) | hsl(120, 75%, 25%) | hsl(120 75 25) | hsl(120deg, 75%, 25%, 0.8) | hsl(120deg, 75%, 25%, 80%) | hsl(120deg 75% 25% / 60%) | hsl(120deg 75% 25% / 0.2)
 * or all w/ hsla(...)
 *
 * @todo Unhandled
 * hsl(none 75% 25%) | any relative values
 */
const hslRegex = /^hsla?\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+%?)\s*[, ]\s*([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i;

/**
 * @typedef {Object} Color
 * @property {number} r - Red (0-255).
 * @property {number} g - Green (0-255).
 * @property {number} b - Blue (0-255).
 * @property {number} h - Hue (0-360).
 * @property {number} s - Saturation (0-100).
 * @property {number} l - Lightness (0-100).
 * @property {number} a - Alpha (0-100).
 */

/**
 * @typedef {Object} CssColors
 * @property {string} hex - #rrggbb or #rrggbbaa.
 * @property {string} rgb - rgb(r g b) or rgb(r g b / a).
 * @property {string} hsl - hsl(h s l) or rgb(h s l / a).
 */

/**
 * Parse out RGB & HSLA from a RGBA input
 *
 * @param {number} r - Red (0-255).
 * @param {number} g - Green (0-255).
 * @param {number} b - Blue (0-255).
 * @param {number} [a=100] - Alpha (0-100).
 * @returns {Color}
 */
const getHSL = (r, g, b, a = 100) => {
  // sanity check
  if (a > 100) throw new Error(`Alpha must be a percentage btwn 0-100. Got: "${a}"`);

  const rPct = r / 255;
  const gPct = g / 255;
  const bPct = b / 255;

  const max = Math.max(rPct, gPct, bPct);
  const min = Math.min(rPct, gPct, bPct);
  const delta = max - min;

  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    if (max === rPct) h = ((gPct - bPct) / delta) % 6;
    else if (max === gPct) h = (bPct - rPct) / delta + 2;
    else h = (rPct - gPct) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  // Convert to percentage
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return { r, g, b, h, s, l, a };
};

/**
 * Parse out RGB & HSLA from a HSLA input
 *
 * @param {number} h - Hue (0-360).
 * @param {number} s - Saturation (0-100).
 * @param {number} l - Lightness (0-100).
 * @param {number} [a=100] - Alpha (0-100).
 * @returns {Color}
 */
const getRGB = (h, s, l, a = 100) => {
  // sanity check
  if (a > 100) throw new Error(`Alpha must be a percentage btwn 0-100. Got: "${a}"`);

  const sDec = s / 100;
  const lDec = l / 100;

  // chroma
  const c = (1 - Math.abs(2 * lDec - 1)) * sDec;
  // intermediate
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  // offset
  const m = lDec - c / 2;

  let r, g, b;
  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  // from % to byte
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b, h, s, l, a };
};

/**
 * Converts a number to a two-character hex string, left-padded with '0' if necessary.
 *
 * @param {number} n - The number to convert (0-255).
 * @returns {string} - A two-character hex string.
 */
const hex = (n) => Math.floor(n).toString(16).padStart(2, "0");

/**
 * Rounds a number to .
 *
 * @param {number} n - The number to convert (0-100).
 * @returns {number}.
 */
const fancy = (n) => parseFloat(n.toFixed(3));

/**
 * Converts a number (0-100) to a percentage string with at most one decimal place.
 *
 * @param {number} n - The number to convert (0-100).
 * @returns {string} - A formatted percentage string (e.g., "50%", "75.5%").
 */
const pct = (n) => `${fancy(n)}%`;

/**
 * Formats an object containing RGB and HSLA values into valid css strings.
 *
 * @param {Color} color
 * @returns {CssColors}
 */
const formatColor = ({ r, g, b, h, s, l, a }) => ({
  hex: a === 100 ? `#${hex(r)}${hex(g)}${hex(b)}` : `#${hex(r)}${hex(g)}${hex(b)}${hex(255 * (a / 100))}`,
  rgb: a === 100 ? `rgb(${fancy(r)} ${fancy(g)} ${fancy(b)})` : `rgb(${fancy(r)} ${fancy(g)} ${fancy(b)} / ${pct(a)})`,
  hsl: a === 100 ? `hsl(${fancy(h)}deg ${pct(s)} ${pct(l)})` : `hsl(${fancy(h)}deg ${pct(s)} ${pct(l)} / ${pct(a)})`,
});

/**
 * Parses a number string and determines if it is a percentage.
 *
 * @param {string} val - The input string ("255", "25%", "0.2").
 * @returns {[boolean, number]} - A tuple [isPercent, parsedNumber].
 */
const parseNumber = (val) => {
  const sanitizedNum = val.replace("%", "");
  const parsedNum = parseFloat(sanitizedNum);
  if (isNaN(parsedNum)) throw new Error(`Unhandled number found "${val}"`);
  return [sanitizedNum !== val, parsedNum];
};

/**
 * Parses a hex color string and extracts RGBA values.
 *
 * @param {string} text - Hopefully a color.
 * @returns {CssColors} - Converted color values.
 * @throws {Error} - If the input format is not any of the possible values.
 */
export const parseCssColor = (text) => {
  text = text.trim();

  // hex
  let match = text.match(hexRegex);
  if (match) {
    let hex = match[1];

    // Expand shorthand notation (#RGB or #RGBA)
    if (hex.length < 6)
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");

    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 2.55 : 100;

    return formatColor(getHSL(r, g, b, a));
  }

  // rgb
  match = text.match(rgbRegex);
  if (match) {
    let isPercent = false;
    let [, r, g, b, a] = match;

    [isPercent, r] = parseNumber(r);
    if (isPercent) r = 255 * (r / 100);

    [isPercent, g] = parseNumber(g);
    if (isPercent) g = 255 * (g / 100);

    [isPercent, b] = parseNumber(b);
    if (isPercent) b = 255 * (b / 100);

    [isPercent, a] = parseNumber(a ?? "100%");
    a = isPercent ? a : a * 100;

    if (r > 255 || g > 255 || b > 255) throw new Error(`Unhandled color format: "${text}"`);
    return formatColor(getHSL(r, g, b, a));
  }

  // hsl
  match = text.match(hslRegex);
  if (match) {
    let isPercent = false;
    let [, h, s, l, a] = match;

    [isPercent, h] = parseNumber(h);
    [isPercent, s] = parseNumber(s);
    [isPercent, l] = parseNumber(l);
    [isPercent, a] = parseNumber(a ?? "100%");
    a = isPercent ? a : a * 100;
    return formatColor(getRGB(h, s, l, a));
  }

  throw new Error(`Unhandled color format: "${text}"`);
};
