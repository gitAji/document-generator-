import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCoffee } from 'react-icons/fa';

function NavbarComponent() {
  return (
    <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: 'var(--navbar-bg-color)' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>TrendifyTools</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'rgba(0,0,0,.1)' }}>
          <span className="navbar-toggler-icon" style={{ filter: 'none' }}></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto flex-grow-1">
            {/* Document Services */}
            <NavDropdown title="Document Tools" id="document-tools-dropdown" menuVariant="light">
              <NavDropdown.Item as={Link} to="/speak-to-write">Speak to Write</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/upload-edit">Upload & Edit Document</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/quote-maker">Quote Maker / Typography Designer</NavDropdown.Item>
            </NavDropdown>

            {/* Image Services */}
            <NavDropdown title="Image Tools" id="image-tools-dropdown" menuVariant="light">
              <NavDropdown.Item as={Link} to="/image-resizer">Image Resizer</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/favicon-tool">Favicon Tool</NavDropdown.Item>
            </NavDropdown>

            {/* Video/Audio Services */}
            <NavDropdown title="Video & Audio Tools" id="video-audio-tools-dropdown" menuVariant="light">
              <NavDropdown.Item as={Link} to="/youtube-generator">YouTube Content Generator</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/audio-trimmer">Audio Trimmer</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/youtube-thumbnail-analyzer">YouTube Thumbnail Analyzer</NavDropdown.Item>
            </NavDropdown>

            {/* Social Media Tools */}
            <NavDropdown title="Social Media Tools" id="social-media-tools-dropdown" menuVariant="light">
              <NavDropdown.Item as={Link} to="/engagement-rate-calculator">Engagement Rate Calculator</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/font-generator">Font Generator for Social Media</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/url-shortener">URL Shortener with Tracking</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/social-media-trend-analyzer">AI-Powered Trend Analysis Tool</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="https://buymeacoffee.com/aone.no" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light ms-lg-3">
              <FaCoffee className="me-2" /> Buy me a Coffee
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;