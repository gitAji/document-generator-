import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavbarComponent() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm" style={{ backgroundColor: '#3700B3' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ color: '#FFFFFF', fontWeight: 'bold' }}>DocGen</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/youtube-generator" style={{ color: '#E0E0E0' }}>
              YouTube Content Generator
            </Nav.Link>
            <Nav.Link as={Link} to="/speak-to-write" style={{ color: '#E0E0E0' }}>
              Speak to Write
            </Nav.Link>
            <Nav.Link as={Link} to="/upload-edit" style={{ color: '#E0E0E0' }}>
              Upload & Edit Document
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;