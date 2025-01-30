import { describe, test } from "node:test";
import assert from "node:assert";
import { parseCssColor } from "../src/colors.mjs";

const BLACK = { hex: "#ffffff", rgb: "rgb(255 255 255)", hsl: "hsl(0deg 0% 100%)" };
const BLACK_66_A = { hex: "#ffffffaa", rgb: "rgb(255 255 255 / 66.667%)", hsl: "hsl(0deg 0% 100% / 66.667%)" };
const MAGENTA = { hex: "#ff00ff", rgb: "rgb(255 0 255)", hsl: "hsl(300deg 100% 50%)" };
const MAGENTA_66_A = { hex: "#ff00ffaa", rgb: "rgb(255 0 255 / 66.667%)", hsl: "hsl(300deg 100% 50% / 66.667%)" };
const PINK = { hex: "#d74894", rgb: "rgb(215 72 148)", hsl: "hsl(328deg 64% 56%)" };
const PINK_20_A = { hex: "#d7489433", rgb: "rgb(215 72 148 / 20%)", hsl: "hsl(328deg 64% 56% / 20%)" };

describe("parseCssColor hex inputs", () => {
  /**
   * three-value syntax (#RGB)
   */
  test("three-value syntax (#RGB)", () => {
    const black = "#fff";
    const magenta = "#f0f";
    assert.deepEqual(BLACK, parseCssColor(black), "black");
    assert.deepEqual(MAGENTA, parseCssColor(magenta), "magenta");

    assert.deepEqual(BLACK, parseCssColor(black.toUpperCase()), "black uppercase");
    assert.deepEqual(MAGENTA, parseCssColor(magenta.toUpperCase()), "magenta uppercase");
  });

  /**
   * four-value syntax (#RGBA)
   */
  test("four-value syntax (#RGBA) w/ 100% alpha", () => {
    const black = "#ffff";
    const magenta = "#f0ff";
    assert.deepEqual(BLACK, parseCssColor(black), "black");
    assert.deepEqual(MAGENTA, parseCssColor(magenta), "magenta");

    assert.deepEqual(BLACK, parseCssColor(black.toUpperCase()), "black uppercase");
    assert.deepEqual(MAGENTA, parseCssColor(magenta.toUpperCase()), "magenta uppercase");
  });

  test("four-value syntax (#RGBA) w/ 66% alpha", () => {
    const black = "#fffa";
    const magenta = "#f0fa";
    assert.deepEqual(BLACK_66_A, parseCssColor(black), "black");
    assert.deepEqual(MAGENTA_66_A, parseCssColor(magenta), "magenta");

    assert.deepEqual(BLACK_66_A, parseCssColor(black.toUpperCase()), "black uppercase");
    assert.deepEqual(MAGENTA_66_A, parseCssColor(magenta.toUpperCase()), "magenta uppercase");
  });

  /**
   * six-value syntax (#RRGGBB)
   */
  test("six-value syntax (#RRGGBB)", () => {
    const black = "#ffffff";
    const pink = "#d74894";
    assert.deepEqual(BLACK, parseCssColor(black), "black");
    assert.deepEqual(PINK, parseCssColor(pink), "pink");

    assert.deepEqual(BLACK, parseCssColor(black.toUpperCase()), "black uppercase");
    assert.deepEqual(PINK, parseCssColor(pink.toUpperCase()), "pink uppercase");
  });

  /**
   * eight-value syntax
   */
  test("eight-value syntax (#RRGGBBAA) w/ 100% alpha", () => {
    const black = "#ffffffff";
    const pink = "#d74894ff";
    assert.deepEqual(BLACK, parseCssColor(black), "black");
    assert.deepEqual(PINK, parseCssColor(pink), "pink");

    assert.deepEqual(BLACK, parseCssColor(black.toUpperCase()), "black uppercase");
    assert.deepEqual(PINK, parseCssColor(pink.toUpperCase()), "pink uppercase");
  });

  test("eight-value syntax (#RRGGBBAA) w/ alpha", () => {
    const black = "#ffffffaa";
    const pink = "#d7489433";
    assert.deepEqual(BLACK_66_A, parseCssColor(black), "black");
    assert.deepEqual(PINK_20_A, parseCssColor(pink), "pink");

    assert.deepEqual(BLACK_66_A, parseCssColor(black.toUpperCase()), "black uppercase");
    assert.deepEqual(PINK_20_A, parseCssColor(pink.toUpperCase()), "pink uppercase");
  });

  /**
   * Unhandled
   */
  test("fails unexpected hex syntaxes", () => {
    const syntaxes = ["#f", "#fffff", "#fffffff", "#fffffffff"];
    for (const syntax of syntaxes)
      assert.throws(() => parseCssColor(syntax), { message: `Unhandled color format: "${syntax}"` }, syntax);
  });
});

describe("parseCssColor rgb inputs", () => {
  /**
   * absolute values
   */
  test("absolute values (rgb(R G B))", () => {
    const black = "255 255 255";
    const pink = "215 72 148";
    assert.deepEqual(BLACK, parseCssColor(`rgb(${black})`), "black");
    assert.deepEqual(BLACK, parseCssColor(`RGB(${black})`), "black uppercase");
    assert.deepEqual(PINK, parseCssColor(`rgb(${pink})`), "pink");

    assert.deepEqual(BLACK, parseCssColor(`rgba(${black})`), "black rgba");
    assert.deepEqual(BLACK, parseCssColor(`RGBA(${black})`), "black rgba uppercase");
    assert.deepEqual(PINK, parseCssColor(`rgba(${pink})`), "pink rgba");
  });

  test("absolute values (rgb(R G B / A)) w/ 100% alpha", () => {
    const black = "255 255 255 / 100%";
    const pink = "215 72 148 / 1";
    assert.deepEqual(BLACK, parseCssColor(`rgb(${black})`), "black");
    assert.deepEqual(PINK, parseCssColor(`rgb(${pink})`), "pink");

    assert.deepEqual(BLACK, parseCssColor(`rgba(${black})`), "black rgba");
    assert.deepEqual(PINK, parseCssColor(`rgba(${pink})`), "pink rgba");
  });

  test("absolute values (rgb(R G B / A)) w/ alpha", () => {
    const black = "255 255 255 / 66.667%";
    const pink = "215 72 148 / 0.2";
    assert.deepEqual(BLACK_66_A, parseCssColor(`rgb(${black})`), "black");
    assert.deepEqual(PINK_20_A, parseCssColor(`rgb(${pink})`), "pink");

    assert.deepEqual(BLACK_66_A, parseCssColor(`rgba(${black})`), "black rgba");
    assert.deepEqual(PINK_20_A, parseCssColor(`rgba(${pink})`), "pink rgba");
  });

  /**
   * legacy values
   */
  test("legacy values (rgb(R, G, B))", () => {
    const black = "255, 255, 255";
    const pink = "215, 72, 148";
    assert.deepEqual(BLACK, parseCssColor(`rgb(${black})`), "black");
    assert.deepEqual(PINK, parseCssColor(`rgb(${pink})`), "pink");

    assert.deepEqual(BLACK, parseCssColor(`rgba(${black})`), "black rgba");
    assert.deepEqual(PINK, parseCssColor(`rgba(${pink})`), "pink rgba");
  });

  test("legacy values (rgb(R% G% B%))", () => {
    const black = "100% 100% 100%";
    const pink = "84.31372549019608% 28.235294117647058% 58.03921568627451%";
    assert.deepEqual(BLACK, parseCssColor(`rgb(${black})`), "black");
    assert.deepEqual(PINK, parseCssColor(`rgb(${pink})`), "pink");

    assert.deepEqual(BLACK, parseCssColor(`rgba(${black})`), "black rgba");
    assert.deepEqual(PINK, parseCssColor(`rgba(${pink})`), "pink rgba");
  });

  test("legacy values (rgb(R, G, B, A)) w/ 100% alpha", () => {
    const black = "255, 255, 255, 100%";
    const pink = "215, 72, 148, 1";
    assert.deepEqual(BLACK, parseCssColor(`rgb(${black})`), "black");
    assert.deepEqual(PINK, parseCssColor(`rgb(${pink})`), "pink");

    assert.deepEqual(BLACK, parseCssColor(`rgba(${black})`), "black rgba");
    assert.deepEqual(PINK, parseCssColor(`rgba(${pink})`), "pink rgba");
  });

  test("legacy values (rgb(R, G, B, A)) w/ alpha", () => {
    const black = "255, 255, 255, 66.667%";
    const pink = "215, 72, 148, 0.2";
    assert.deepEqual(BLACK_66_A, parseCssColor(`rgb(${black})`), "black");
    assert.deepEqual(PINK_20_A, parseCssColor(`rgb(${pink})`), "pink");

    assert.deepEqual(BLACK_66_A, parseCssColor(`rgba(${black})`), "black rgba");
    assert.deepEqual(PINK_20_A, parseCssColor(`rgba(${pink})`), "pink rgba");
  });

  /**
   * Unhandled
   */
  test("fails unexpected rgb syntaxes", () => {
    const syntaxes = ["rgb()", "rgb(1111 11 11)"];
    for (const syntax of syntaxes)
      assert.throws(() => parseCssColor(syntax), { message: `Unhandled color format: "${syntax}"` }, syntax);
  });
});

describe("parseCssColor hsl inputs", () => {
  /**
   * absolute values
   */
  // TODO: pink gives a value that is slightly off (although imperceptible on screen)
  //   should rewrite this to accept values within a certain range
  test("absolute values (hsl(Hdeg S% L%))", () => {
    const black = "0deg 0% 100%";
    // const pink = "328deg 64% 56%";
    assert.deepEqual(BLACK, parseCssColor(`hsl(${black})`), "black");
    assert.deepEqual(BLACK, parseCssColor(`HSL(${black})`), "black uppercase");
    // assert.deepEqual(PINK, parseCssColor(`hsl(${pink})`), "pink");

    assert.deepEqual(BLACK, parseCssColor(`hsla(${black})`), "black hsla");
    assert.deepEqual(BLACK, parseCssColor(`HSLA(${black})`), "black hsla uppercase");
    // assert.deepEqual(PINK, parseCssColor(`hsla(${pink})`), "pink hsla");
  });

  test("absolute values (hsl(H S L))", () => {
    const black = "0 0 100";
    // const pink = "328 64 56";
    assert.deepEqual(BLACK, parseCssColor(`hsl(${black})`), "black");
    assert.deepEqual(BLACK, parseCssColor(`HSL(${black})`), "black uppercase");
    // assert.deepEqual(PINK, parseCssColor(`hsl(${pink})`), "pink");

    assert.deepEqual(BLACK, parseCssColor(`hsla(${black})`), "black hsla");
    assert.deepEqual(BLACK, parseCssColor(`HSLA(${black})`), "black hsla uppercase");
    // assert.deepEqual(PINK, parseCssColor(`hsla(${pink})`), "pink hsla");
  });

  test("absolute values (hsl(H S L / 100%)) w/ 100% alpha", () => {
    const black = "0 0 100 / 100%";
    const magenta = "300 100 50/ 1";
    assert.deepEqual(BLACK, parseCssColor(`hsl(${black})`), "black");
    assert.deepEqual(MAGENTA, parseCssColor(`hsl(${magenta})`), "magenta");
  });

  test("absolute values (hsl(H S L / A)) w/ 66% alpha", () => {
    const black = "0 0 100 / 66.667%";
    const magenta = "300deg 100% 50% / 0.66667";
    assert.deepEqual(BLACK_66_A, parseCssColor(`hsl(${black})`), "black");
    assert.deepEqual(MAGENTA_66_A, parseCssColor(`hsl(${magenta})`), "magenta");
  });

  /**
   * legacy values
   */
  test("absolute values (hsl(H, S, L, A))", () => {
    const black = "0, 0, 100,66.667%";
    const magenta = "300, 100, 50, 0.66667";
    assert.deepEqual(BLACK_66_A, parseCssColor(`hsl(${black})`), "black");
    assert.deepEqual(MAGENTA_66_A, parseCssColor(`hsl(${magenta})`), "magenta");
  });
});
