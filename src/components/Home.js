import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-center py-5 bg-primary text-white">
        <Container>
          <h1>Welcome to Documents Generator</h1>
          <p className="lead">Your all-in-one solution for document creation, voice-to-text, and content generation.</p>
          <Button variant="light" size="lg" as={Link} to="/speak-to-write">Get Started</Button>
        </Container>
      </section>

      {/* Services Section */}
      <section className="services-section py-5">
        <Container>
          <h2 className="text-center mb-4">Our Services</h2>
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>YouTube Content Generator</Card.Title>
                  <Card.Text>
                    Generate descriptions, keywords, and AI-powered thumbnails for your YouTube videos.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/youtube-generator" className="mt-auto">Go to Service</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>Speak to Write</Card.Title>
                  <Card.Text>
                    Convert your spoken words into editable text documents with ease.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/speak-to-write" className="mt-auto">Go to Service</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>Upload & Edit Document</Card.Title>
                  <Card.Text>
                    Upload PDF or other documents and edit them like a word processor.
                  </Card.Text>
                  <Button variant="primary" as={Link} to="/upload-edit" className="mt-auto">Go to Service</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Other Section */}
      <section className="other-section py-5 bg-light">
        <Container>
          <h2 className="text-center mb-4">Why Choose Us?</h2>
          <Row>
            <Col md={6}>
              <h3>Efficiency</h3>
              <p>Streamline your content creation and document management workflows.</p>
            </Col>
            <Col md={6}>
              <h3>Innovation</h3>
              <p>Leverage AI-powered tools for smart content generation and editing.</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;
