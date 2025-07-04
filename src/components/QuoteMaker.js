import React, { useState, useRef } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { SketchPicker } from "react-color";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

function QuoteMaker() {
  const [quoteText, setQuoteText] = useState("");
  const [quoteAuthor, setQuoteAuthor] = useState("");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#007bff");
  const [fontSize, setFontSize] = useState(48);
  const [padding, setPadding] = useState(40);
  const [isLoading, setIsLoading] = useState(false);
  const quoteCardRef = useRef(null);

  const generateNewQuote = async () => {
    setIsLoading(true);
    // Simulate AI API call
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    const aiQuotes = [
      {
        text: '"The only way to do great work is to love what you do."',
        author: "Steve Jobs",
      },
      {
        text: '"Innovation distinguishes between a leader and a follower."',
        author: "Steve Jobs",
      },
      {
        text: `"Your time is limited, so don't waste it living someone else's life."`,
        author: "Steve Jobs",
      },
      {
        text: '"Strive not to be a success, but rather to be of value."',
        author: "Albert Einstein",
      },
      {
        text: '"The mind is everything. What you think you become."',
        author: "Buddha",
      },
      {
        text: '"The best way to predict the future is to create it."',
        author: "Peter Drucker",
      },
      {
        text: '"Believe you can and you are halfway there."',
        author: "Theodore Roosevelt",
      },
      {
        text: '"The future belongs to those who believe in the beauty of their dreams."',
        author: "Eleanor Roosevelt",
      },
      {
        text: `"It is during our darkest moments that we must focus to see the light."`,
        author: "Aristotle Onassis",
      },
    ];

    const randomIndex = Math.floor(Math.random() * aiQuotes.length);
    setQuoteText(aiQuotes[randomIndex].text);
    setQuoteAuthor(aiQuotes[randomIndex].author);
    setIsLoading(false);
  };

  // Initial quote generation on component mount
  React.useEffect(() => {
    generateNewQuote();
  }, []);

  const handleDownloadImage = () => {
    if (quoteCardRef.current) {
      html2canvas(quoteCardRef.current, { scale: 2 }).then((canvas) => {
        canvas.toBlob(function (blob) {
          saveAs(blob, "quote-image.png");
        });
      });
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Quote Maker / Typography Designer</h1>
      <Row>
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Quote Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quote Author</Form.Label>
                <Form.Control
                  type="text"
                  value={quoteAuthor}
                  onChange={(e) => setQuoteAuthor(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Font Family</Form.Label>
                <Form.Control
                  as="select"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                >
                  <option>Arial</option>
                  <option>Verdana</option>
                  <option>Georgia</option>
                  <option>Times New Roman</option>
                  <option>Courier New</option>
                  <option>Montserrat</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Font Size</Form.Label>
                <Form.Control
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  min={12}
                  max={100}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Padding</Form.Label>
                <Form.Control
                  type="number"
                  value={padding}
                  onChange={(e) => setPadding(parseInt(e.target.value))}
                  min={0}
                  max={100}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Text Color</Form.Label>
                <SketchPicker
                  color={textColor}
                  onChangeComplete={(color) => setTextColor(color.hex)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Background Color</Form.Label>
                <SketchPicker
                  color={bgColor}
                  onChangeComplete={(color) => setBgColor(color.hex)}
                />
              </Form.Group>

              <Button
                variant="primary"
                onClick={generateNewQuote}
                className="me-2"
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate New Quote"}
              </Button>
              <Button
                variant="secondary"
                onClick={handleDownloadImage}
                disabled={isLoading}
              >
                Download Quote Image
              </Button>
            </Form>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm mt-3 mt-md-0" ref={quoteCardRef}>
            <Card.Body
              style={{
                backgroundColor: bgColor,
                color: textColor,
                fontFamily: fontFamily,
                fontSize: `${fontSize}px`,
                padding: `${padding}px`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
              }}
            >
              {isLoading ? (
                <p>Loading Quote...</p>
              ) : (
                <blockquote className="blockquote mb-0 text-center">
                  <p style={{ fontSize: `${fontSize}px`, lineHeight: 1.2 }}>
                    {quoteText}
                  </p>
                  {quoteAuthor && (
                    <footer
                      className="blockquote-footer text-white"
                      style={{ fontSize: `${fontSize * 0.6}px` }}
                    >
                      {quoteAuthor}
                    </footer>
                  )}
                </blockquote>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default QuoteMaker;
