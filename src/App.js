import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import FooterComponent from './components/FooterComponent';
import Home from './components/Home';
import SpeakToWrite from './components/SpeakToWrite';
import DocumentUploadEditor from './components/DocumentUploadEditor';
import YoutubeContentGenerator from './components/YoutubeContentGenerator';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Keep App.css for general styling if needed

function App() {
  return (
    <Router>
      <NavbarComponent />
      <div className="content-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/speak-to-write" element={<SpeakToWrite />} />
          <Route path="/upload-edit" element={<DocumentUploadEditor />} />
          <Route path="/youtube-generator" element={<YoutubeContentGenerator />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
      </div>
      <FooterComponent />
    </Router>
  );
}

export default App;