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
import FaviconTool from './components/FaviconTool';
import ImageResizer from './components/ImageResizer';
import AudioTrimmer from './components/AudioTrimmer';
import QuoteMaker from './components/QuoteMaker';
import YoutubeThumbnailAnalyzer from './components/YoutubeThumbnailAnalyzer';
import EngagementRateCalculator from './components/EngagementRateCalculator';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Keep App.css for general styling if needed

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100"> {/* Added flexbox classes */}
        <NavbarComponent />
        <div className="flex-grow-1"> {/* This will push the footer down */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/speak-to-write" element={<SpeakToWrite />} />
            <Route path="/upload-edit" element={<DocumentUploadEditor />} />
            <Route path="/youtube-generator" element={<YoutubeContentGenerator />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/favicon-tool" element={<FaviconTool />} />
            <Route path="/image-resizer" element={<ImageResizer />} />
            <Route path="/audio-trimmer" element={<AudioTrimmer />} />
            <Route path="/quote-maker" element={<QuoteMaker />} />
            <Route path="/youtube-thumbnail-analyzer" element={<YoutubeThumbnailAnalyzer />} />
            <Route path="/engagement-rate-calculator" element={<EngagementRateCalculator />} />
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </Router>
  );
}

export default App;