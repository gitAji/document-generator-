import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-center py-5" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--background-color)', minHeight: '500px', display: 'flex', alignItems: 'center', backgroundImage: 'url(%PUBLIC_URL%/hero.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <Container>
          <h1>Welcome to Documents Generator</h1>
          <p className="lead">Your all-in-one solution for document creation, voice-to-text, and content generation.</p>
          <Button variant="secondary" size="lg" as={Link} to="/speak-to-write">Get Started</Button>
        </Container>
      </section>

      {/* Services Section */}
      <section className="services-section py-5" style={{ backgroundColor: 'var(--background-color)' }}>
        <Container>
          <h2 className="text-center mb-4" style={{ color: 'var(--text-color)' }}>Our Services</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: 'var(--primary-color)' }}>YouTube Content Generator</Card.Title>
                  <Card.Text style={{ color: 'var(--text-color)' }}>
                    Generate descriptions, keywords, and AI-powered thumbnails for your YouTube videos.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/youtube-generator" className="mt-auto">Go to Service</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: 'var(--primary-color)' }}>Speak to Write</Card.Title>
                  <Card.Text style={{ color: 'var(--text-color)' }}>
                    Convert your spoken words into editable text documents with ease.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/speak-to-write" className="mt-auto">Go to Service</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: 'var(--primary-color)' }}>Upload & Edit Document</Card.Title>
                  <Card.Text style={{ color: 'var(--text-color)' }}>
                    Upload PDF or other documents and edit them like a word processor.
                  </Card.Text>
                  <Button style={{ backgroundColor: 'var(--primary-color)', color: 'var(--background-color)' }} variant="primary" as={Link} to="/upload-edit" className="mt-auto">Go to Service</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: 'var(--primary-color)' }}>Image Resizer</Card.Title>
                  <Card.Text style={{ color: 'var(--text-color)' }}>
                    Resize your images quickly and efficiently for various platforms.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/image-resizer" className="mt-auto">Go to Service</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: 'var(--primary-color)' }}>Audio Trimmer</Card.Title>
                  <Card.Text style={{ color: 'var(--text-color)' }}>
                    Trim and cut audio files to your desired length.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/audio-trimmer" className="mt-auto">Go to Service</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: 'var(--primary-color)' }}>Quote Maker</Card.Title>
                  <Card.Text style={{ color: 'var(--text-color)' }}>
                    Design beautiful quotes with custom typography and backgrounds.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/quote-maker" className="mt-auto">Go to Service</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: 'var(--primary-color)' }}>YouTube Thumbnail Analyzer</Card.Title>
                  <Card.Text style={{ color: 'var(--text-color)' }}>
                    Analyze the effectiveness of your YouTube thumbnails.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/youtube-thumbnail-analyzer" className="mt-auto">Go to Service</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: 'var(--primary-color)' }}>Engagement Rate Calculator</Card.Title>
                  <Card.Text style={{ color: 'var(--text-color)' }}>
                    Calculate your social media engagement rate.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/engagement-rate-calculator" className="mt-auto">Go to Service</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: 'var(--primary-color)' }}>Favicon Tool</Card.Title>
                  <Card.Text style={{ color: 'var(--text-color)' }}>
                    Create and edit favicons from text or images.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/favicon-tool" className="mt-auto">Go to Service</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us-section py-5" style={{ backgroundColor: 'var(--background-color)' }}>
        <Container>
          <h2 className="text-center mb-5" style={{ color: 'var(--primary-color)' }}>Why Choose Us?</h2>
          <Row className="g-4 justify-content-center">
            <Col md={4}>
              <Card className="h-100 text-center shadow-sm p-3">
                <Card.Body>
                  <i className="bi bi-lightning-charge-fill" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                  <Card.Title className="mt-3" style={{ color: 'var(--text-color)' }}>Efficiency</Card.Title>
                  <Card.Text style={{ color: 'var(--text-color)' }}>
                    Streamline your content creation and document management workflows with our intuitive tools.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 text-center shadow-sm p-3">
                <Card.Body>
                  <i className="bi bi-lightbulb-fill" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                  <Card.Title className="mt-3" style={{ color: 'var(--text-color)' }}>Innovation</Card.Title>
                  <Card.Text style={{ color: 'var(--text-color)' }}>
                    Leverage cutting-edge AI-powered features for smart content generation and editing.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 text-center shadow-sm p-3">
                <Card.Body>
                  <i className="bi bi-shield-check-fill" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                  <Card.Title className="mt-3" style={{ color: 'var(--text-color)' }}>Reliability</Card.Title>
                  <Card.Text style={{ color: 'var(--text-color)' }}>
                    Count on our robust platform for consistent performance and secure document handling.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;
