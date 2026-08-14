import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Button, Row, Col, Card, Badge } from "react-bootstrap";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";

// Builds a { 'A': '𝐀', 'a': '𝐚', ... } map from the start code point of a
// contiguous Unicode block. `exceptions` covers the handful of letters that
// Unicode reassigns to pre-existing symbols instead of a new code point
// (e.g. the script capital "R" is the legacy ℛ, not a dedicated slot).
function buildLetterMap(upperStart, lowerStart, exceptions = {}) {
  const map = {};
  for (let i = 0; i < 26; i++) {
    const upper = UPPER[i];
    const lower = LOWER[i];
    map[upper] = exceptions[upper] || String.fromCodePoint(upperStart + i);
    map[lower] = exceptions[lower] || String.fromCodePoint(lowerStart + i);
  }
  return map;
}

// Some blocks (circled/squared/negative-squared letters) only ever defined
// capitals — lowercase input falls back to its uppercase glyph.
function buildUpperOnlyMap(start) {
  const map = {};
  for (let i = 0; i < 26; i++) {
    map[UPPER[i]] = String.fromCodePoint(start + i);
  }
  return map;
}

function buildDigitMap(start) {
  const map = {};
  for (let i = 0; i < 10; i++) {
    map[DIGITS[i]] = String.fromCodePoint(start + i);
  }
  return map;
}

function mergeMaps(...maps) {
  return Object.assign({}, ...maps);
}

function mapText(text, map, { fallbackUpper = false } = {}) {
  return text
    .split("")
    .map((char) => {
      if (map[char]) return map[char];
      if (fallbackUpper) {
        const upper = char.toUpperCase();
        if (map[upper]) return map[upper];
      }
      return char;
    })
    .join("");
}

// Character maps, mostly drawn from the Mathematical Alphanumeric Symbols
// block (U+1D400-U+1D7FF), plus a few supplementary blocks below.
const CHARACTER_MAPS = {
  bold: mergeMaps(buildLetterMap(0x1d5d4, 0x1d5ee), buildDigitMap(0x1d7ec)), // sans-serif bold — reads as "bold" on most social platforms
  italic: buildLetterMap(0x1d434, 0x1d44e, { H: "ℎ" }),
  boldItalic: buildLetterMap(0x1d468, 0x1d482),
  cursive: buildLetterMap(0x1d49c, 0x1d4b6, {
    B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ",
    L: "ℒ", M: "ℳ", R: "ℛ",
    e: "ℯ", g: "ℊ", o: "ℴ",
  }),
  boldCursive: buildLetterMap(0x1d4d0, 0x1d4ea),
  fraktur: buildLetterMap(0x1d504, 0x1d51e, {
    C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ",
  }),
  boldFraktur: buildLetterMap(0x1d56c, 0x1d586),
  doubleStruck: mergeMaps(
    buildLetterMap(0x1d538, 0x1d552, {
      C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ",
      Q: "ℚ", R: "ℝ", Z: "ℤ",
    }),
    buildDigitMap(0x1d7d8)
  ),
  sansSerif: mergeMaps(buildLetterMap(0x1d5a0, 0x1d5ba), buildDigitMap(0x1d7e2)),
  sansSerifItalic: buildLetterMap(0x1d608, 0x1d622),
  sansSerifBoldItalic: buildLetterMap(0x1d63c, 0x1d656),
  monospace: mergeMaps(buildLetterMap(0x1d670, 0x1d68a), buildDigitMap(0x1d7f6)),
  fullwidth: mergeMaps(buildLetterMap(0xff21, 0xff41), buildDigitMap(0xff10)),
  circled: mergeMaps(buildLetterMap(0x24b6, 0x24d0), {
    0: "⓪", 1: "①", 2: "②", 3: "③", 4: "④",
    5: "⑤", 6: "⑥", 7: "⑦", 8: "⑧", 9: "⑨",
  }),
  squared: buildUpperOnlyMap(0x1f130),
  negativeSquared: buildUpperOnlyMap(0x1f170),
  negativeCircled: buildUpperOnlyMap(0x1f150),
};

// A few styles only cover part of the alphabet (Unicode never standardized
// the rest) — unmapped characters simply pass through unchanged.
const SMALL_CAPS_MAP = {
  a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ",
  g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ",
  m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ",
  s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x",
  y: "ʏ", z: "ᴢ",
};

const SUPERSCRIPT_MAP = {
  a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ", f: "ᶠ",
  g: "ᵍ", h: "ʰ", i: "ⁱ", j: "ʲ", k: "ᵏ", l: "ˡ",
  m: "ᵐ", n: "ⁿ", o: "ᵒ", p: "ᵖ", r: "ʳ", s: "ˢ",
  t: "ᵗ", u: "ᵘ", v: "ᵛ", w: "ʷ", x: "ˣ", y: "ʸ",
  z: "ᶻ",
  0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵",
  6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹",
  "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
};

const SUBSCRIPT_MAP = {
  a: "ₐ", e: "ₑ", h: "ₕ", i: "ᵢ", j: "ⱼ", k: "ₖ",
  l: "ₗ", m: "ₘ", n: "ₙ", o: "ₒ", p: "ₚ", r: "ᵣ",
  s: "ₛ", t: "ₜ", u: "ᵤ", v: "ᵥ", x: "ₓ",
  0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅",
  6: "₆", 7: "₇", 8: "₈", 9: "₉",
  "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
};

// Irregular, hand-picked glyph-per-character map (not a contiguous block).
const UPSIDE_DOWN_MAP = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ",
  g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ", k: "ʞ", l: "l",
  m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s",
  t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  A: "∀", B: "𐐒", C: "Ɔ", D: "ᗡ", E: "Ǝ",
  F: "Ⅎ", G: "פ", H: "H", I: "I", J: "ſ", K: "ʞ",
  L: "˥", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Q", R: "ᴚ",
  S: "S", T: "⊥", U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄",
  Z: "Z",
  0: "0", 1: "Ɩ", 2: "ᄅ", 3: "Ɛ", 4: "ㄣ", 5: "ϛ",
  6: "9", 7: "ㄥ", 8: "8", 9: "6",
};

function fromLookupMap(map) {
  return (text) =>
    text
      .split("")
      .map((char) => map[char] || map[char.toLowerCase()] || char)
      .join("");
}

// Font styles: `normal` plus every Unicode-based transformation offered below.
const styles = {
  normal: (text) => text,
  bold: (text) => mapText(text, CHARACTER_MAPS.bold),
  italic: (text) => mapText(text, CHARACTER_MAPS.italic),
  boldItalic: (text) => mapText(text, CHARACTER_MAPS.boldItalic),
  cursive: (text) => mapText(text, CHARACTER_MAPS.cursive),
  boldCursive: (text) => mapText(text, CHARACTER_MAPS.boldCursive),
  fraktur: (text) => mapText(text, CHARACTER_MAPS.fraktur),
  boldFraktur: (text) => mapText(text, CHARACTER_MAPS.boldFraktur),
  doubleStruck: (text) => mapText(text, CHARACTER_MAPS.doubleStruck),
  sansSerif: (text) => mapText(text, CHARACTER_MAPS.sansSerif),
  sansSerifItalic: (text) => mapText(text, CHARACTER_MAPS.sansSerifItalic),
  sansSerifBoldItalic: (text) => mapText(text, CHARACTER_MAPS.sansSerifBoldItalic),
  monospace: (text) => mapText(text, CHARACTER_MAPS.monospace),
  fullwidth: (text) => mapText(text, CHARACTER_MAPS.fullwidth),
  circled: (text) => mapText(text, CHARACTER_MAPS.circled),
  squared: (text) => mapText(text, CHARACTER_MAPS.squared, { fallbackUpper: true }),
  negativeSquared: (text) => mapText(text, CHARACTER_MAPS.negativeSquared, { fallbackUpper: true }),
  negativeCircled: (text) => mapText(text, CHARACTER_MAPS.negativeCircled, { fallbackUpper: true }),
  smallCaps: fromLookupMap(SMALL_CAPS_MAP),
  superscript: fromLookupMap(SUPERSCRIPT_MAP),
  subscript: fromLookupMap(SUBSCRIPT_MAP),
  upsideDown: (text) => text.split("").reverse().map((char) => UPSIDE_DOWN_MAP[char] || char).join(""),
  strikethrough: (text) => text.split("").map((char) => char + "̶").join(""),
  doubleStrikethrough: (text) => text.split("").map((char) => char + "̶̶").join(""),
  underline: (text) => text.split("").map((char) => char + "̲").join(""),
};

const styleLabels = {
  boldCursive: "Bold Cursive",
  sansSerif: "Sans Serif",
  sansSerifItalic: "Sans Serif Italic",
  sansSerifBoldItalic: "Sans Serif Bold Italic",
};

function labelFromKey(key) {
  return (
    styleLabels[key] ||
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  );
}

function generateStyledText(text, style) {
  return styles[style] ? styles[style](text) : text;
}

function FontGenerator() {
  const [inputText, setInputText] = useState("Hello World!");
  const [selectedStyle, setSelectedStyle] = useState("normal");
  const [copiedStyleKey, setCopiedStyleKey] = useState(null);
  const outputRef = useRef(null);
  const copyTimeoutRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(copyTimeoutRef.current);
  }, []);

  const handleCopyStyle = async (styleKey, text) => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStyleKey(styleKey);
      window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => setCopiedStyleKey(null), 1500);
    } catch (err) {
      console.error("Could not copy text: ", err);
      alert("Failed to copy to clipboard.");
    }
  };

  const handleDownloadImage = () => {
    if (outputRef.current) {
      html2canvas(outputRef.current, { scale: 2 }).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "styled-text-image.png");
        });
      });
    }
  };

  const previewText = generateStyledText(inputText, selectedStyle);
  const hasText = inputText.trim().length > 0;

  return (
    <Container className="my-5">
      <h1 className="mb-4">Font Generator for Social Media</h1>
      <Row>
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Enter Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Style</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                >
                  {Object.keys(styles).map((styleKey) => (
                    <option key={styleKey} value={styleKey}>
                      {labelFromKey(styleKey)}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Button variant="primary" onClick={handleDownloadImage}>
                Export as Image
              </Button>
            </Form>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm mt-3 mt-md-0">
            <Card.Body className="text-center">
              <Card.Title>
                Preview{" "}
                <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                  (click text to copy)
                </small>
              </Card.Title>
              <div
                ref={outputRef}
                onClick={() => handleCopyStyle(selectedStyle, previewText)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleCopyStyle(selectedStyle, previewText);
                }}
                style={{ fontSize: "2rem", wordWrap: "break-word", cursor: hasText ? "pointer" : "default" }}
                title="Click to copy"
              >
                {previewText}
              </div>
              {copiedStyleKey === selectedStyle && (
                <Badge bg="success" className="mt-2">Copied!</Badge>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-5">
        <h4 className="mb-1">All Styles</h4>
        <p className="text-muted">Click any style's text below to copy it to your clipboard.</p>
        <Row className="g-3">
          {Object.keys(styles).map((styleKey) => {
            const styledText = generateStyledText(inputText, styleKey);
            const isCopied = copiedStyleKey === styleKey;
            return (
              <Col md={6} key={styleKey}>
                <Card
                  className="h-100 shadow-sm"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCopyStyle(styleKey, styledText)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") handleCopyStyle(styleKey, styledText);
                  }}
                  style={{ cursor: hasText ? "pointer" : "default", opacity: hasText ? 1 : 0.6 }}
                  title="Click to copy"
                >
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <div style={{ overflow: "hidden" }}>
                      <div className="text-muted small mb-1">{labelFromKey(styleKey)}</div>
                      <div style={{ fontSize: "1.1rem", wordBreak: "break-word" }}>
                        {styledText || <span className="text-muted">&nbsp;</span>}
                      </div>
                    </div>
                    {isCopied && <Badge bg="success" className="ms-2">Copied!</Badge>}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </Container>
  );
}

export default FontGenerator;
