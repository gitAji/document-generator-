import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import SpeakToWrite from './components/SpeakToWrite';
import DocumentUploadEditor from './components/DocumentUploadEditor';
import YoutubeContentGenerator from './components/YoutubeContentGenerator';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Keep App.css for general styling if needed

function App() {
  return (
    <Router>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<YoutubeContentGenerator />} />
        <Route path="/speak-to-write" element={<SpeakToWrite />} />
        <Route path="/upload-edit" element={<DocumentUploadEditor />} />
        <Route path="/youtube-generator" element={<YoutubeContentGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;