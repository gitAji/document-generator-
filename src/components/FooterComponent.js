import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function FooterComponent() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-start">
            <p>&copy; {new Date().getFullYear()} Documents Generator. All rights reserved.</p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p>
              <a href="/privacy-policy" className="text-white me-2">Privacy Policy</a>
              <a href="/terms-of-service" className="text-white">Terms of Service</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default FooterComponent;
