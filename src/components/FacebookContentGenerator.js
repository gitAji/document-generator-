import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FaFacebook } from 'react-icons/fa';
import { saveAs } from 'file-saver';

function FacebookContentGenerator() {
  const [facebookUrl, setFacebookUrl] = useState('');
  const [topic, setTopic] = useState('');
  const [resultsLimit, setResultsLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sourcePosts, setSourcePosts] = useState([]);
  const [generatedPost, setGeneratedPost] = useState('');

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!facebookUrl.trim()) {
      setError('Please enter a Facebook page URL.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');
    setSourcePosts([]);
    setGeneratedPost('');

    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facebookUrl: facebookUrl.trim(),
          topic: topic.trim(),
          resultsLimit,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate post.');
      }

      setSourcePosts(data.posts || []);
      setGeneratedPost(data.generatedPost || '');
      if (data.message) {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch((err) => {
      console.error('Could not copy text: ', err);
      alert('Failed to copy to clipboard.');
    });
  };

  const handleExport = (text) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'facebook_generated_post.txt');
  };

  return (
    <Container className="mt-4 mb-5">
      <h2 className="mb-2">
        <FaFacebook className="me-2" style={{ color: 'var(--primary-color)' }} />
        Facebook Content Generator
      </h2>
      <p className="text-muted mb-4">
        Enter a public Facebook page, and we'll pull its recent posts and use AI to draft a brand-new,
        original post inspired by what's working for that page.
      </p>

      <Card className="shadow-sm p-3 mb-4">
        <Form onSubmit={handleGenerate}>
          <Row className="g-3">
            <Col md={7}>
              <Form.Group controlId="facebookUrl">
                <Form.Label>Facebook Page URL</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://www.facebook.com/somepage/"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="topic">
                <Form.Label>Topic / Theme (optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. product launch"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="resultsLimit">
                <Form.Label>Posts to scan</Form.Label>
                <Form.Select
                  value={resultsLimit}
                  onChange={(e) => setResultsLimit(Number(e.target.value))}
                >
                  {[3, 5, 8, 10].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Button
            type="submit"
            className="mt-3"
            variant="primary"
            style={{ backgroundColor: 'var(--primary-color)', color: 'var(--background-color)' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Generating...
              </>
            ) : (
              'Generate Post'
            )}
          </Button>
        </Form>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}
      {message && !error && <Alert variant="info">{message}</Alert>}

      {generatedPost && (
        <Card className="shadow-sm p-3 mb-4">
          <Card.Body>
            <Card.Title>AI-Generated Post</Card.Title>
            <Form.Control
              as="textarea"
              rows={6}
              value={generatedPost}
              readOnly
              className="mb-2"
            />
            <Button
              size="sm"
              variant="primary"
              style={{ backgroundColor: 'var(--primary-color)', color: 'var(--background-color)' }}
              onClick={() => copyToClipboard(generatedPost)}
            >
              Copy
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="ms-2"
              style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--background-color)' }}
              onClick={() => handleExport(generatedPost)}
            >
              Export (.txt)
            </Button>
          </Card.Body>
        </Card>
      )}

      {sourcePosts.length > 0 && (
        <div>
          <h5 className="mb-3">Source Posts Used for Inspiration</h5>
          <Row className="g-3">
            {sourcePosts.map((post, index) => (
              <Col md={6} key={index}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Text style={{ maxHeight: '120px', overflow: 'hidden' }}>
                      {post.text || '(no text)'}
                    </Card.Text>
                    <small className="text-muted d-block mb-2">
                      👍 {post.likes} &nbsp; 💬 {post.comments} &nbsp; 🔁 {post.shares}
                    </small>
                    {post.url && (
                      <Button variant="outline-primary" size="sm" href={post.url} target="_blank" rel="noopener noreferrer">
                        View Original Post
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <Alert variant="secondary" className="mt-5">
        <strong>Note:</strong> This tool only scrapes public Facebook pages, not private profiles or personal
        data. It calls a server-side function that runs the Apify Facebook Posts Scraper Actor and Anthropic's
        Claude API — no API keys are exposed to the browser.
      </Alert>
    </Container>
  );
}

export default FacebookContentGenerator;
