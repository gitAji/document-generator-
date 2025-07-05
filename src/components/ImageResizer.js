import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { saveAs } from "file-saver";

function ImageResizer() {
  const [imageFile, setImageFile] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [resizedImageUrl, setResizedImageUrl] = useState(null); // ✅ Fix 1

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalWidth(img.width);
          setOriginalHeight(img.height);
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
      setResizedImageUrl(null); // Reset preview when new image is uploaded
    }
  };

  const handleWidthChange = (e) => {
    const newWidth = parseInt(e.target.value);
    if (!isNaN(newWidth)) {
      setWidth(newWidth);
      if (aspectRatioLocked) {
        setHeight(Math.round(newWidth * (originalHeight / originalWidth)));
      }
    } else {
      setWidth("");
    }
  };

  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value);
    if (!isNaN(newHeight)) {
      setHeight(newHeight);
      if (aspectRatioLocked) {
        setWidth(Math.round(newHeight * (originalWidth / originalHeight)));
      }
    } else {
      setHeight("");
    }
  };

  const handleResizeAndDownload = () => {
    if (!imageFile || !width || !height) {
      alert("Please upload an image and enter valid dimensions.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = URL.createObjectURL(imageFile);
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);

      // Update preview
      const dataUrl = canvas.toDataURL(imageFile.type);
      setResizedImageUrl(dataUrl); // ✅ Fix 2

      // Download
      canvas.toBlob((blob) => {
        saveAs(blob, `resized_${imageFile.name}`);
      }, imageFile.type);
    };
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Image Resizer</h1>
      <Row>
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <Form>
              <Form.Group controlId="imageUpload" className="mb-3">
                <Form.Label>Upload Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Form.Group>

              {imageFile && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Original Dimensions</Form.Label>
                    <Form.Control
                      type="text"
                      value={`${originalWidth} x ${originalHeight}`}
                      readOnly
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Width</Form.Label>
                    <Form.Control
                      type="number"
                      value={width}
                      onChange={handleWidthChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Height</Form.Label>
                    <Form.Control
                      type="number"
                      value={height}
                      onChange={handleHeightChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Lock Aspect Ratio"
                      checked={aspectRatioLocked}
                      onChange={(e) => setAspectRatioLocked(e.target.checked)}
                    />
                  </Form.Group>

                  <Button variant="primary" onClick={handleResizeAndDownload}>
                    Resize & Download
                  </Button>
                </>
              )}
            </Form>
          </Card>
        </Col>

        <Col md={6}>
          {imageFile && (
            <Card className="shadow-sm mt-3 mt-md-0">
              <Card.Body className="text-center">
                <Card.Title>Preview</Card.Title>
                <img
                  src={
                    resizedImageUrl
                      ? resizedImageUrl
                      : URL.createObjectURL(imageFile)
                  }
                  alt="Preview"
                  className="img-fluid"
                  style={{ maxWidth: "100%", maxHeight: "400px" }}
                />
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ImageResizer;
