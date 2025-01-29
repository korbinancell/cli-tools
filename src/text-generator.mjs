import { randInt } from "./utils.mjs";

// prettier-ignore
const smallText = { a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ", f: "ᶠ", g: "ᵍ", h: "ʰ", i: "ⁱ", j: "ʲ", k: "ᵏ", l: "ˡ", m: "ᵐ", n: "ⁿ", o: "ᵒ", p: "ᵖ", q: "ᑫ", r: "ʳ", s: "ˢ", t: "ᵗ", u: "ᵘ", v: "ᵛ", w: "ʷ", x: "ˣ", y: "ʸ", z: "ᶻ", A: "ᵃ", B: "ᵇ", C: "ᶜ", D: "ᵈ", E: "ᵉ", F: "ᶠ", G: "ᵍ", H: "ʰ", I: "ⁱ", J: "ʲ", K: "ᵏ", L: "ˡ", M: "ᵐ", N: "ⁿ", O: "ᵒ", P: "ᵖ", Q: "ᵠ", R: "ʳ", S: "ˢ", T: "ᵗ", U: "ᵘ", V: "ᵛ", X: "ˣ", W: "ʷ", Y: "ʸ", Z: "ᶻ", "`": "`", "~": "~", "!": "﹗", "@": "@", "#": "#", $: "﹩", "%": "﹪", "^": "^", "&": "﹠", "*": "﹡", "(": "⁽", ")": "⁾", _: "⁻", "-": "⁻", "=": "⁼", "+": "+", "{": "{", "[": "[", "}": "}", "]": "]", ":": "﹕", ";": "﹔", "?": "﹖", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", };
// prettier-ignore
const smallCaps = { a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "q", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ", A: "A", B: "B", C: "C", D: "D", E: "E", F: "F", G: "G", H: "H", I: "I", J: "J", K: "K", L: "L", M: "M", N: "N", O: "O", P: "P", Q: "Q", R: "R", S: "S", T: "T", U: "U", V: "V", W: "W", X: "X", Y: "Y", Z: "Z", "`": "`", "~": "~", "!": "﹗", "@": "@", "#": "#", $: "﹩", "%": "﹪", "^": "^", "&": "﹠", "*": "﹡", "(": "⁽", ")": "⁾", _: "⁻", "-": "⁻", "=": "⁼", "+": "+", "{": "{", "[": "[", "}": "}", "]": "]", ":": "﹕", ";": "﹔", "?": "﹖", 0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", };
// prettier-ignore
const upsideDown = { a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ı", j: "ɾ", k: "ʞ", l: "ן", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z", A: "ɐ", B: "q", C: "ɔ", D: "p", E: "ǝ", F: "ɟ", G: "ƃ", H: "ɥ", I: "ı", J: "ɾ", K: "ʞ", L: "ן", M: "ɯ", N: "u", O: "o", P: "d", Q: "b", R: "ɹ", S: "s", T: "ʇ", U: "n", V: "𐌡", X: "x", W: "ʍ", Y: "ʎ", Z: "z", "`": "`", "~": "~", "!": "¡", "@": "@", "#": "#", $: "﹩", "%": "﹪", "^": "^", "&": "⅋", "*": "*", "(": ")", ")": "(", _: "⁻", "-": "-", "=": "=", "+": "+", "{": "}", "[": "]", "}": "{", "]": "[", ":": ":", ";": ";", "?": "¿", 0: "0", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", };

// zalgo stuff https://metacpan.org/pod/Acme::Zalgo & https://github.com/Marak/colors.js
// prettier-ignore
const overChars = [ '̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀', '́', '̋', '̏', '̒', '̓', '̔', '̽', '̉', 'ͣ', 'ͤ', 'ͥ', 'ͦ', 'ͧ', 'ͨ', 'ͩ', 'ͪ', 'ͫ', 'ͬ', 'ͭ', 'ͮ', 'ͯ', '̾', '͛', '͆', '̚' ];
// prettier-ignore
const midChars = [ '̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͏', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡', '҉' ];
// prettier-ignore
const underChars = [ '̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͔', '͕', '͖', '͙', '͚', '̣' ];

const zalgoRegex = RegExp(`(${[...overChars, ...midChars, ...underChars].join("|")})`, "g");

const segment = (text) => [...new Intl.Segmenter().segment(text)].map((c) => c.segment);

export const toSmallText = (text) =>
  segment(text)
    .map((c) => smallText[c] ?? c)
    .join("");

export const toSmallCaps = (text) =>
  segment(text)
    .map((c) => smallCaps[c] ?? c)
    .join("");

export const toUpsideDown = (text) =>
  segment(text)
    .map((c) => upsideDown[c] ?? c)
    .reverse()
    .join("");

export const zalgoize = (text, intensity) =>
  segment(text)
    .map((c) => {
      // emoji or already weird
      if (c.length > 1 || zalgoRegex.test(c) || c === " ") return c;

      const up = randInt(16 * intensity) + 1;
      const mid = randInt(6 * intensity);
      const dn = randInt(16 * intensity) + 1;
      for (let [count, chars] of [
        [up, overChars],
        [mid, midChars],
        [dn, underChars],
      ]) {
        while (count-- > 0) {
          c += chars[randInt(chars.length - 1)];
        }
      }

      return c;
    })
    .join("");
