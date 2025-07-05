import React, { useState, useRef } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

function FontGenerator() {
  const [inputText, setInputText] = useState("Hello World!");
  const [selectedStyle, setSelectedStyle] = useState("normal");
  const outputRef = useRef(null);

  // Font styles as transformations
  const styles = {
    normal: (text) => text,
    bold: (text) =>
      text
        .split("")
        .map((char) => transformCharacter(char, "bold"))
        .join(""),
    italic: (text) =>
      text
        .split("")
        .map((char) => transformCharacter(char, "italic"))
        .join(""),
    boldItalic: (text) =>
      text
        .split("")
        .map((char) => transformCharacter(char, "boldItalic"))
        .join(""),
    cursive: (text) =>
      text
        .split("")
        .map((char) => transformCharacter(char, "cursive"))
        .join(""),
    upsideDown: (text) =>
      text
        .split("")
        .reverse()
        .map((char) => transformCharacter(char, "upsideDown"))
        .join(""),
    strikethrough: (text) =>
      text
        .split("")
        .map((char) => char + "\u0336")
        .join(""),
    doubleStrikethrough: (text) =>
      text
        .split("")
        .map((char) => char + "\u0336\u0336")
        .join(""),
    underline: (text) =>
      text
        .split("")
        .map((char) => char + "\u0332")
        .join(""),
  };

  // Character transformation mapping function
  const transformCharacter = (char, style) => {
    const transformations = {
      bold: {
        a: "𝗮",
        b: "𝗯",
        c: "𝗰",
        d: "𝗱",
        e: "𝗲",
        f: "𝗳",
        g: "𝗴",
        h: "𝗵",
        i: "𝗶",
        j: "𝗷",
        k: "𝗸",
        l: "𝗹",
        m: "𝗺",
        n: "𝗻",
        o: "𝗼",
        p: "𝗽",
        q: "𝗾",
        r: "𝗿",
        s: "𝘀",
        t: "𝘁",
        u: "𝘂",
        v: "𝘃",
        w: "𝘄",
        x: "𝘅",
        y: "𝘆",
        z: "𝘇",
        A: "𝗔",
        B: "𝗕",
        C: "𝗖",
        D: "𝗗",
        E: "𝗘",
        F: "𝗙",
        G: "𝗚",
        H: "𝗛",
        I: "𝗜",
        J: "𝗝",
        K: "𝗞",
        L: "𝗟",
        M: "𝗠",
        N: "𝗡",
        O: "𝗢",
        P: "𝗣",
        Q: "𝗤",
        R: "𝗥",
        S: "𝗦",
        T: "𝗧",
        U: "𝗨",
        V: "𝗩",
        W: "𝗪",
        X: "𝗫",
        Y: "𝗬",
        Z: "𝗭",
      },
      italic: {
        a: "𝑎",
        b: "𝑏",
        c: "𝑐",
        d: "𝑑",
        e: "𝑒",
        f: "𝑓",
        g: "𝑔",
        h: "ℎ",
        i: "𝑖",
        j: "𝑗",
        k: "𝑘",
        l: "𝑙",
        m: "𝑚",
        n: "𝑛",
        o: "𝑜",
        p: "𝑝",
        q: "𝑞",
        r: "𝑟",
        s: "𝑠",
        t: "𝑡",
        u: "𝑢",
        v: "𝑣",
        w: "𝑤",
        x: "𝑥",
        y: "𝑦",
        z: "𝑧",
        A: "𝐴",
        B: "𝐵",
        C: "𝐶",
        D: "𝐷",
        E: "𝐸",
        F: "𝐹",
        G: "𝐺",
        H: "𝐻",
        I: "𝐼",
        J: "𝑱",
        K: "𝐾",
        L: "𝐿",
        M: "𝑀",
        N: "𝑁",
        O: "𝑂",
        P: "𝑃",
        Q: "𝑄",
        R: "𝑅",
        S: "𝑆",
        T: "𝑇",
        U: "𝑈",
        V: "𝑉",
        W: "𝑊",
        X: "𝑋",
        Y: "𝑌",
        Z: "𝑍",
      },
      boldItalic: {
        a: "𝒂",
        b: "𝒃",
        c: "𝒄",
        d: "𝒅",
        e: "𝒆",
        f: "𝒇",
        g: "𝒈",
        h: "𝒉",
        i: "𝒊",
        j: "𝒋",
        k: "𝒌",
        l: "𝒍",
        m: "𝒎",
        n: "𝒏",
        o: "𝒐",
        p: "𝒑",
        q: "𝒒",
        r: "𝒓",
        s: "𝒔",
        t: "𝒕",
        u: "𝒖",
        v: "𝒗",
        w: "𝒘",
        x: "𝒙",
        y: "𝒚",
        z: "𝒛",
        A: "𝒜",
        B: "𝒝",
        C: "𝒞",
        D: "𝒟",
        E: "ℰ",
        F: "ℱ",
        G: "𝒢",
        H: "ℋ",
        I: "ℐ",
        J: "𝒥",
        K: "𝒦",
        L: "ℒ",
        M: "ℳ",
        N: "𝒩",
        O: "𝒪",
        P: "𝒫",
        Q: "𝒬",
        R: "ℝ",
        S: "𝒮",
        T: "𝒯",
        U: "𝒰",
        V: "𝒱",
        W: "𝒲",
        X: "𝒳",
        Y: "𝒴",
        Z: "𝒵",
      },
      cursive: {
        a: "𝒶",
        b: "𝒷",
        c: "𝒸",
        d: "𝒹",
        e: "ℯ",
        f: "𝒻",
        g: "𝒼",
        h: "𝒽",
        i: "𝒾",
        j: "𝒿",
        k: "𝓀",
        l: "𝓁",
        m: "𝓂",
        n: "𝓃",
        o: "ℴ",
        p: "𝓅",
        q: "𝓆",
        r: "𝓇",
        s: "𝓈",
        t: "𝓉",
        u: "𝓊",
        v: "𝓋",
        w: "𝓌",
        x: "𝓍",
        y: "𝓎",
        z: "𝓏",
        A: "𝒜",
        B: "𝐵",
        C: "𝒞",
        D: "𝒟",
        E: "𝐸",
        F: "𝒻",
        G: "𝒢",
        H: "𝒽",
        I: "𝒾",
        J: "𝒥",
        K: "𝒦",
        L: "ℒ",
        M: "𝒴",
        N: "𝒩",
        O: "𝒪",
        P: "𝒫",
        Q: "𝒬",
        R: "𝒭",
        S: "𝒮",
        T: "𝒯",
        U: "𝒲",
        V: "𝒱",
        W: "𝒲",
        X: "𝒳",
        Y: "𝒴",
        Z: "𝒵",
      },
      upsideDown: {
        a: "ɐ",
        b: "q",
        c: "ɔ",
        d: "p",
        e: "ǝ",
        f: "ɟ",
        g: "ƃ",
        h: "ɥ",
        i: "ᴉ",
        j: "ɾ",
        k: "ʞ",
        l: "l",
        m: "ɯ",
        n: "u",
        o: "o",
        p: "d",
        q: "b",
        r: "ɹ",
        s: "s",
        t: "ʇ",
        u: "n",
        v: "ʌ",
        w: "ʍ",
        y: "ʎ",
        z: "z",
        A: "∀",
        B: "𐐒",
        C: "Ɔ",
        D: "ᗡ",
        E: "Ǝ",
        F: "Ⅎ",
        G: "פ",
        H: "H",
        I: "I",
        J: "ſ",
        K: "Ʞ",
        L: "˥",
        M: "W",
        N: "N",
        O: "O",
        P: "Ԁ",
        Q: "Q",
        R: "ᴚ",
        S: "S",
        T: "⊥",
        U: "∩",
        V: "Λ",
        W: "M",
        Y: "⅄",
        Z: "Z",
      },
    };

    return transformations[style][char] || char; // Return the transformed character or original one
  };

  const generateStyledText = (text, style) => {
    return styles[style] ? styles[style](text) : text;
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
                      {styleKey
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
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
              <Card.Title>Preview</Card.Title>
              <div
                ref={outputRef}
                style={{ fontSize: "2rem", wordWrap: "break-word" }}
              >
                {generateStyledText(inputText, selectedStyle)}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default FontGenerator;
