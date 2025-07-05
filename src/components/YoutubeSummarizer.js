import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';

function YoutubeSummarizer() {
  const [videoUrl, setVideoUrl] = useState('');
  const [summary, setSummary] = useState(null);
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractVideoId = (url) => {
    const regExp = /^(?:https?:\/\/(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/|)([^&?]*)(?:[&?].*)?|https?:\/\/(?:www\.)?youtu\.be\/([^&?]*)(?:[&?].*)?)$/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
  };

  const APYHUB_API_KEY = 'YOUR_APYHUB_API_KEY'; // Replace with your ApyHub API Key

  const handleSummarizeVideo = async () => {
    setLoading(true);
    setSummary(null);
    setScript(null);
    setError('');

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      setError('Please enter a valid YouTube video URL.');
      setLoading(false);
      return;
    }

    try {
      // For a real implementation, you would first fetch the actual transcript
      // using a YouTube Data API or a third-party service.
      // For now, we'll use a simulated transcript.
      const simulatedTranscript = `[0:00] Introduction to the topic.\n[0:30] Key concept one explained in detail.\n[1:15] Example demonstrating concept one.\n[2:00] Transition to key concept two.\n[2:45] Key concept two discussed.\n[3:30] Practical application of concept two.\n[4:00] Summary of main points.\n[4:45] Call to action and conclusion.`;

      const response = await fetch('https://api.apyhub.com/data/text/summarize/url', {
        method: 'POST',
        headers: {
          'apy-token': APYHUB_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: videoUrl, // ApyHub can summarize directly from URL
          // For text summarization, you would use: text: simulatedTranscript
          output_type: 'json',
          summary_length: 'short', // or 'medium', 'long'
        }),
      });

      const data = await response.json();

      if (response.ok && data.data) {
        setSummary({
          title: `Summary of: ${videoUrl}`,
          keyPoints: data.data.summary.split('. ').filter(Boolean), // ApyHub returns a single summary string
          fullScript: simulatedTranscript, // Still simulated
        });
      } else {
        setError(data.message || 'Failed to summarize video. Please check your API key or URL.');
      }

    } catch (err) {
      setError('Failed to connect to summarization service.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowScript = () => {
    if (summary && summary.fullScript) {
      setScript(summary.fullScript);
    } else {
      alert('Please summarize the video first to get the script.');
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">YouTube Summarizer</h1>
      <Row>
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>YouTube Video URL</Form.Label>
                <Form.Control
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
                  required
                />
              </Form.Group>

              <Button variant="primary" onClick={handleSummarizeVideo} disabled={loading || !videoUrl}>
                {loading ? 'Summarizing...' : 'Summarize Video'}
              </Button>

              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

              {summary && (
                <div className="mt-4">
                  <h5>Summary:</h5>
                  <p>{summary.title}</p>
                  <h6>Key Points:</h6>
                  <ul>
                    {summary.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                  <Button variant="outline-secondary" onClick={handleShowScript} className="mt-3">
                    Show Full Script
                  </Button>
                </div>
              )}
            </Form>
          </Card>
        </Col>
        <Col md={6}>
          {script && (
            <Card className="shadow-sm mt-3 mt-md-0 p-3">
              <Card.Body>
                <Card.Title>Full Video Script</Card.Title>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '400px', overflowY: 'auto' }}>{script}</pre>
              </Card.Body>
            </Card>
          )}
          {!script && (
            <Card className="shadow-sm mt-3 mt-md-0 p-3">
              <Card.Body>
                <Card.Title>Instructions</Card.Title>
                <p>Enter a YouTube video URL and click "Summarize Video" to get a brief summary and key points. You can then click "Show Full Script" to view the entire video transcript.</p>
                <p>Note: This tool simulates summarization and script extraction. Real functionality would require integration with YouTube Data API and advanced NLP models.</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default YoutubeSummarizer;
