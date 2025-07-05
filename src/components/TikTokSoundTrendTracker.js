import React, { useState } from 'react';
import { Container, Button, Row, Col, Card, Alert } from 'react-bootstrap';

function TikTokSoundTrendTracker() {
  const [trendingSounds, setTrendingSounds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTrendingSounds = async () => {
    setLoading(true);
    setError('');
    setTrendingSounds([]);

    try {
      // Simulate fetching data from a TikTok API or a data source
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

      const simulatedSounds = [
        { id: 'sound1', name: 'Upbeat Summer Vibes', creator: '@musicmaker', uses: '1.2M', link: 'https://www.tiktok.com/music/Upbeat-Summer-Vibes-123456789' },
        { id: 'sound2', name: 'Chill Study Beats', creator: '@lofi_beats', uses: '850K', link: 'https://www.tiktok.com/music/Chill-Study-Beats-987654321' },
        { id: 'sound3', name: 'Dramatic Reveal', creator: '@filmmaker_fx', uses: '2.1M', link: 'https://www.tiktok.com/music/Dramatic-Reveal-456789123' },
        { id: 'sound4', name: 'Funny Cat Meow', creator: '@catlover_official', uses: '500K', link: 'https://www.tiktok.com/music/Funny-Cat-Meow-654321987' },
      ];
      setTrendingSounds(simulatedSounds);

    } catch (err) {
      setError('Failed to fetch trending sounds. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">TikTok Sound Trend Tracker</h1>
      <Row>
        <Col md={12}>
          <Card className="shadow-sm p-3">
            <Card.Body>
              <Card.Title>Discover Trending Sounds</Card.Title>
              <Card.Text>
                Identify the most popular songs and sounds across TikTok to boost your content's reach.
              </Card.Text>
              <Button variant="primary" onClick={fetchTrendingSounds} disabled={loading}>
                {loading ? 'Fetching...' : 'Fetch Trending Sounds'}
              </Button>
              {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

              {trendingSounds.length > 0 && (
                <div className="mt-4">
                  <h5>Current Trending Sounds:</h5>
                  <ul className="list-group">
                    {trendingSounds.map(sound => (
                      <li key={sound.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{sound.name}</strong> by {sound.creator}
                          <br />
                          <small>Uses: {sound.uses}</small>
                        </div>
                        <Button variant="outline-primary" size="sm" href={sound.link} target="_blank" rel="noopener noreferrer">
                          Listen on TikTok
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TikTokSoundTrendTracker;
