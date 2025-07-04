import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

function EngagementRateCalculator() {
  const [followers, setFollowers] = useState('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [engagementRate, setEngagementRate] = useState(null);
  const [explanation, setExplanation] = useState('');

  const calculateEngagementRate = () => {
    const numFollowers = parseFloat(followers);
    const numLikes = parseFloat(likes);
    const numComments = parseFloat(comments);

    if (isNaN(numFollowers) || isNaN(numLikes) || isNaN(numComments) || numFollowers <= 0) {
      setEngagementRate(null);
      setExplanation('Please enter valid positive numbers for all fields.');
      return;
    }

    // Simple engagement rate formula: (Likes + Comments) / Followers * 100
    const rate = ((numLikes + numComments) / numFollowers) * 100;
    setEngagementRate(rate.toFixed(2));

    let explanationText = `Your engagement rate is ${rate.toFixed(2)}%.`;

    if (rate < 1) {
      explanationText += ' This is generally considered a low engagement rate.';
    } else if (rate >= 1 && rate < 3) {
      explanationText += ' This is a good, average engagement rate.';
    } else if (rate >= 3 && rate < 6) {
      explanationText += ' This is considered a high engagement rate.';
    } else {
      explanationText += ' This is an excellent, very high engagement rate!';
    }

    explanationText += ' A higher engagement rate indicates that your content resonates well with your audience.';
    setExplanation(explanationText);
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Engagement Rate Calculator</h1>
      <Row>
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Followers</Form.Label>
                <Form.Control
                  type="number"
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                  placeholder="Enter number of followers"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Likes</Form.Label>
                <Form.Control
                  type="number"
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                  placeholder="Enter number of likes"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Comments</Form.Label>
                <Form.Control
                  type="number"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter number of comments"
                />
              </Form.Group>

              <Button variant="primary" onClick={calculateEngagementRate}>
                Calculate Engagement Rate
              </Button>
            </Form>
          </Card>
        </Col>
        <Col md={6}>
          {engagementRate !== null && (
            <Card className="shadow-sm p-3 mt-3 mt-md-0">
              <Card.Body>
                <Card.Title>Your Engagement Rate:</Card.Title>
                <h2 className="text-primary">{engagementRate}%</h2>
                <Card.Text>{explanation}</Card.Text>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default EngagementRateCalculator;
