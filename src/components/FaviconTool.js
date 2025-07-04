import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { SketchPicker } from 'react-color';

// Favicon sizes to generate
const faviconSizes = [16, 32, 48, 64, 128, 256];

function FaviconTool() {
  const [text, setText] = useState('FG');
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#007bff');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(64);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const canvasRef = useRef(null);

  const drawFavicon = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const size = 256; // Base size for drawing
    canvas.width = size;
    canvas.height = size;

    // Draw background
    context.fillStyle = bgColor;
    context.fillRect(0, 0, size, size);

    if (imageFile) {
      const img = new Image();
      img.onload = () => {
        // Calculate aspect ratio to fit image within canvas
        const hRatio = size / img.width;
        const vRatio = size / img.height;
        const ratio = Math.min(hRatio, vRatio);
        const centerShiftX = (size - img.width * ratio) / 2;
        const centerShiftY = (size - img.height * ratio) / 2;
        context.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
        const dataUrl = canvas.toDataURL();
        setPreviewUrl(dataUrl);
      };
      img.src = URL.createObjectURL(imageFile);
    } else {
      // Draw text
      context.font = `${fontSize}px ${fontFamily}`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillStyle = textColor;
      context.fillText(text, size / 2, size / 2);
      const dataUrl = canvas.toDataURL();
      setPreviewUrl(dataUrl);
    }
  }, [text, textColor, bgColor, fontFamily, fontSize, imageFile]);

  useEffect(() => {
    drawFavicon();
  }, [text, textColor, bgColor, fontFamily, fontSize, imageFile, drawFavicon]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setText(''); // Clear text when image is uploaded
    }
  };

  const generateAndDownload = async () => {
    const zip = new JSZip();
    const baseCanvas = canvasRef.current;

    for (const size of faviconSizes) {
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = size;
      offscreenCanvas.height = size;
      const context = offscreenCanvas.getContext('2d');
      context.drawImage(baseCanvas, 0, 0, size, size);

      const blob = await new Promise(resolve => offscreenCanvas.toBlob(resolve, 'image/png'));
      zip.file(`favicon-${size}x${size}.png`, blob);
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
      saveAs(content, 'favicons.zip');
    });
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Favicon Generator</h2>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Favicon Type</Form.Label>
            <Form.Check
              type="radio"
              label="Text Favicon"
              name="faviconType"
              id="textFavicon"
              checked={!imageFile}
              onChange={() => setImageFile(null)}
            />
            <Form.Check
              type="radio"
              label="Image Favicon"
              name="faviconType"
              id="imageFavicon"
              checked={!!imageFile}
              onChange={() => {}}
            />
          </Form.Group>

          {!imageFile ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Text</Form.Label>
                <Form.Control type="text" value={text} onChange={(e) => setText(e.target.value)} maxLength={3} />
                <Form.Text className="text-muted">Max 3 characters</Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Text Color</Form.Label>
                <SketchPicker color={textColor} onChangeComplete={(color) => setTextColor(color.hex)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Background Color</Form.Label>
                <SketchPicker color={bgColor} onChangeComplete={(color) => setBgColor(color.hex)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Font Family</Form.Label>
                <Form.Control as="select" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
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
                <Form.Control type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} min={16} max={128} />
              </Form.Group>
            </>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
            </Form.Group>
          )}

          <Button variant="primary" onClick={generateAndDownload} className="mt-3">
            Generate & Download Favicons
          </Button>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Favicon Preview (256x256)</Card.Title>
              <canvas ref={canvasRef} style={{ border: '1px solid #ccc', width: '256px', height: '256px' }}></canvas>
              {previewUrl && <img src={previewUrl} alt="Favicon Preview" className="img-fluid mt-3" style={{ border: '1px solid #ccc' }} />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default FaviconTool;
