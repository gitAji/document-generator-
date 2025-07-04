import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavbarComponent() {
  return (
    <Navbar bg="light" variant="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ color: '#333' }}>Voice Document Generator</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/youtube-generator" style={{ color: '#555' }}>
              YouTube Content Generator
            </Nav.Link>
            <Nav.Link as={Link} to="/speak-to-write" style={{ color: '#555' }}>
              Speak to Write
            </Nav.Link>
            <Nav.Link as={Link} to="/upload-edit" style={{ color: '#555' }}>
              Upload & Edit Document
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;