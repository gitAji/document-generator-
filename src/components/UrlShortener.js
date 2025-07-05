import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';

function UrlShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState(null);

  const SHORT_IO_API_KEY = 'sk_8gyCNv1ParPw6ONj'; // Your short.io API Key
  const SHORT_IO_DOMAIN = 'your-short-domain.com'; // Replace with your short.io domain

  const handleShortenUrl = async () => {
    setLoading(true);
    setError('');
    setShortUrl('');
    setAnalytics(null);

    try {
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      if (!urlRegex.test(longUrl)) {
        setError('Please enter a valid URL (e.g., https://example.com).');
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.short.io/links', {
        method: 'POST',
        headers: {
          'Authorization': SHORT_IO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalURL: longUrl,
          domain: SHORT_IO_DOMAIN,
          path: customSlug || undefined, // Use custom slug if provided
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(data.shortURL);
        // short.io provides analytics, but integrating them fully would require more complex setup.
        // Keeping simulated analytics for demonstration.
        setAnalytics({
          clicks: Math.floor(Math.random() * 1000),
          location: 'Global',
          lastClicked: new Date().toLocaleString()
        });
      } else {
        setError(data.message || 'Failed to shorten URL.');
      }
    } catch (err) {
      setError('Failed to connect to URL shortening service.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">URL Shortener with Tracking</h1>
      <Row>
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Long URL</Form.Label>
                <Form.Control
                  type="url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="Enter your long URL here (e.g., https://example.com/very/long/path)"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Custom Slug (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="e.g., my-awesome-link"
                />
              </Form.Group>

              <Button variant="primary" onClick={handleShortenUrl} disabled={loading || !longUrl}>
                {loading ? 'Shortening...' : 'Shorten URL'}
              </Button>

              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

              {shortUrl && (
                <div className="mt-4">
                  <h5>Shortened URL:</h5>
                  <p><a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
                  <Button variant="outline-secondary" onClick={() => navigator.clipboard.writeText(shortUrl)}>
                    Copy Short URL
                  </Button>
                </div>
              )}
            </Form>
          </Card>
        </Col>
        <Col md={6}>
          {analytics && (
            <Card className="shadow-sm mt-3 mt-md-0 p-3">
              <Card.Body>
                <Card.Title>Analytics for {shortUrl}</Card.Title>
                <p><strong>Total Clicks:</strong> {analytics.clicks}</p>
                <p><strong>Geographic Location:</strong> {analytics.location}</p>
                <p><strong>Last Clicked:</strong> {analytics.lastClicked}</p>
                <Alert variant="info" className="mt-3">
                  Note: Real-time analytics would require integration with a live URL shortening service.
                </Alert>
              </Card.Body>
            </Card>
          )}
          {!analytics && (
            <Card className="shadow-sm mt-3 mt-md-0 p-3">
              <Card.Body>
                <Card.Title>How it Works</Card.Title>
                <p>Enter a long URL and optionally a custom slug. We'll provide a shortened URL. If you use a real service, you'd get actual click analytics here!</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default UrlShortener;
