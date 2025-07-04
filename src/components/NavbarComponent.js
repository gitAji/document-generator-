import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavbarComponent() {
  return (
    <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: 'var(--navbar-bg-color)' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ color: 'var(--background-color)', fontWeight: 'bold' }}>DocGen</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: 'var(--background-color)' }}>
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/youtube-generator" style={{ color: 'var(--background-color)' }}>
              YouTube Content Generator
            </Nav.Link>
            <Nav.Link as={Link} to="/speak-to-write" style={{ color: 'var(--background-color)' }}>
              Speak to Write
            </Nav.Link>
            <Nav.Link as={Link} to="/upload-edit" style={{ color: 'var(--background-color)' }}>
              Upload & Edit Document
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;