import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <section
        className="hero-section text-center py-5"
        style={{
          color: "var(--background-color)",
          minHeight: "600px",
          display: "flex",
          alignItems: "center",
          backgroundImage: "url(/hero.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container>
          <h1 className="display-4 fw-bold">
            Your Creative Toolkit for Digital Content
          </h1>
          <p className="lead mb-5">
            Streamline your workflow with powerful tools for document creation,
            content generation, and media editing.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() =>
              document
                .getElementById("services-section")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Our Services
          </Button>
        </Container>
      </section>

      {/* Services Section */}
      <section
        id="services-section"
        className="services-section py-5"
        style={{ backgroundColor: "var(--background-color)" }}
      >
        <Container>
          <h2
            className="text-center mb-4"
            style={{ color: "var(--text-color)" }}
          >
            Our Services
          </h2>
          <Row className="g-4">
            <Col md={4}>
              <Card
                className="h-100 shadow-sm"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "var(--primary-color)" }}>
                    YouTube Content Generator
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Generate descriptions, keywords, and AI-powered thumbnails
                    for your YouTube videos.
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/youtube-generator"
                    className="mt-auto"
                  >
                    Go to Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="h-100 shadow-sm"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "var(--primary-color)" }}>
                    Speak to Write
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Convert your spoken words into editable text documents with
                    ease.
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/speak-to-write"
                    className="mt-auto"
                  >
                    Go to Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="h-100 shadow-sm"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "var(--primary-color)" }}>
                    Upload & Edit Document
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Upload PDF or other documents and edit them like a word
                    processor.
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/upload-edit"
                    className="mt-auto"
                  >
                    Go to Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="h-100 shadow-sm"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "var(--primary-color)" }}>
                    Image Resizer
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Resize your images quickly and efficiently for various
                    platforms.
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/image-resizer"
                    className="mt-auto"
                  >
                    Go to Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="h-100 shadow-sm"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "var(--primary-color)" }}>
                    Audio Trimmer
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Trim and cut audio files to your desired length.
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/audio-trimmer"
                    className="mt-auto"
                  >
                    Go to Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="h-100 shadow-sm"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "var(--primary-color)" }}>
                    Quote Maker
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Design beautiful quotes with custom typography and
                    backgrounds.
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/quote-maker"
                    className="mt-auto"
                  >
                    Go to Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="h-100 shadow-sm"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "var(--primary-color)" }}>
                    YouTube Thumbnail Analyzer
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Analyze the effectiveness of your YouTube thumbnails.
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/youtube-thumbnail-analyzer"
                    className="mt-auto"
                  >
                    Go to Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="h-100 shadow-sm"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "var(--primary-color)" }}>
                    Engagement Rate Calculator
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Calculate your social media engagement rate.
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/engagement-rate-calculator"
                    className="mt-auto"
                  >
                    Go to Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="h-100 shadow-sm"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "var(--primary-color)" }}>
                    Favicon Tool
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Create and edit favicons from text or images.
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/favicon-tool"
                    className="mt-auto"
                  >
                    Go to Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="h-100 shadow-sm"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "var(--primary-color)" }}>
                    Font Generator for Social Media
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Create cool and unique fonts for captions, stories, and
                    posts.
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/font-generator"
                    className="mt-auto"
                  >
                    Go to Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="h-100 shadow-sm"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "var(--primary-color)" }}>
                    URL Shortener with Tracking
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Shorten URLs for easier sharing on social media and track
                    clicks.
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/url-shortener"
                    className="mt-auto"
                  >
                    Go to Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="h-100 shadow-sm"
                style={{ backgroundColor: "var(--background-color)" }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ color: "var(--primary-color)" }}>
                    TikTok Sound Trend Tracker
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Help influencers identify trending sounds on TikTok.
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/tiktok-sound-tracker"
                    className="mt-auto"
                  >
                    Go to Service
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section
        className="why-choose-us-section py-5"
        style={{ backgroundColor: "var(--background-color)" }}
      >
        <Container>
          <h2
            className="text-center mb-5"
            style={{ color: "var(--primary-color)" }}
          >
            Why Choose Us?
          </h2>
          <Row className="g-4 justify-content-center">
            <Col md={4}>
              <Card className="h-100 text-center shadow-sm p-3">
                <Card.Body>
                  <i
                    className="bi bi-lightning-charge-fill"
                    style={{ fontSize: "3rem", color: "var(--primary-color)" }}
                  ></i>
                  <Card.Title
                    className="mt-3"
                    style={{ color: "var(--text-color)" }}
                  >
                    Efficiency
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Streamline your content creation and document management
                    workflows with our intuitive tools.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 text-center shadow-sm p-3">
                <Card.Body>
                  <i
                    className="bi bi-lightbulb-fill"
                    style={{ fontSize: "3rem", color: "var(--primary-color)" }}
                  ></i>
                  <Card.Title
                    className="mt-3"
                    style={{ color: "var(--text-color)" }}
                  >
                    Innovation
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Leverage cutting-edge AI-powered features for smart content
                    generation and editing.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 text-center shadow-sm p-3">
                <Card.Body>
                  <i
                    className="bi bi-shield-check-fill"
                    style={{ fontSize: "3rem", color: "var(--primary-color)" }}
                  ></i>
                  <Card.Title
                    className="mt-3"
                    style={{ color: "var(--text-color)" }}
                  >
                    Reliability
                  </Card.Title>
                  <Card.Text style={{ color: "var(--text-color)" }}>
                    Count on our robust platform for consistent performance and
                    secure document handling.
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
