import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Form, Row, Col } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaMicrophone, FaStop } from 'react-icons/fa';

function YoutubeContentGenerator() {
  const [videoTitle, setVideoTitle] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechRecognitionReady, setIsSpeechRecognitionReady] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState('');
  const [channelName, setChannelName] = useState('');
  
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailText, setThumbnailText] = useState('');
  const [thumbnailMode, setThumbnailMode] = useState('manual'); // 'manual' or 'ai-generated'
  const [aiThumbnailBackground, setAiThumbnailBackground] = useState('');
  const [aiThumbnailTextColor, setAiThumbnailTextColor] = useState('#333');
  
  const thumbnailQuillRef = useRef(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    let recognitionInstance = null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false; // We only need a single utterance for the title
      recognitionInstance.interimResults = false;
      

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVideoTitle(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognitionInstance;
      setIsSpeechRecognitionReady(true);
    } else {
      console.warn('Speech Recognition API not supported in this browser.');
      setIsSpeechRecognitionReady(false);
    }

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const handleSpeakToggle = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setVideoTitle(''); // Clear previous title
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        console.warn('Speech Recognition API not available.');
      }
    }
  };

  const generateContent = () => {
    if (!videoTitle) {
      alert('Please provide a video title first.');
      return;
    }

    const titleLower = videoTitle.toLowerCase();
    const titleWords = titleLower.split(' ');

    // Enhanced simulated AI generation for description
    let description = `${videoTitle} | ${channelName || 'Your Channel Name'}

Welcome to ${channelName || 'Our Channel'}! In this video, we’ll dive deep into **${videoTitle}**. Learn about ${titleWords[0] || 'this topic'} and discover key insights into ${titleWords[1] || 'its applications'}. This guide will help you understand ${videoTitle} better.

Key Takeaways:
- Understanding the basics of ${titleWords[0] || 'the subject'}
- Exploring advanced concepts in ${titleWords[1] || 'the field'}
- Practical tips for ${titleWords[2] || 'implementation'}

For more content like this, subscribe to our channel!

`;

    // Enhanced simulated AI generation for keywords
    const baseKeywords = titleWords.join(', ');
    const additionalKeywords = [
      `${videoTitle} tutorial`,
      `${videoTitle} guide`,
      `${videoTitle} explained`,
      `${titleWords[0]} tips`,
      `${titleWords[1]} strategies`,
      `youtube content`,
      `video creation`,
    ].filter(Boolean).join(', ');

    const hashtags = titleWords.map(word => `#${word}`).join(' ');

    description += `
${hashtags}`;

    setGeneratedDescription(description);
    setGeneratedKeywords(`${baseKeywords}, ${additionalKeywords}`);

    

    // AI thumbnail generation based on title
    const getTitleHash = (title) => {
      let hash = 0;
      for (let i = 0; i < title.length; i++) {
        const char = title.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

    const hash = getTitleHash(videoTitle);

    const palettes = [
      ['#FF6B6B', '#4ECDC4'], ['#F9D423', '#FF4E50'], ['#8E2DE2', '#4A00E0'],
      ['#11998e', '#38ef7d'], ['#FC5C7D', '#6A82FB'], ['#00C9FF', '#92FE9D'],
      ['#ff9a9e', '#fecfef'], ['#f6d365', '#fda085'], ['#43e97b', '#38f9d7'],
      ['#fa709a', '#fee140'], ['#12c2e9', '#c471ed', '#f64f59']
    ];

    const selectedPalette = palettes[hash % palettes.length];
    const angle = hash % 360;
    const gradient = `linear-gradient(${angle}deg, ${selectedPalette.join(', ')})`;

    // Simple brightness check for text color
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    };
    const rgb = hexToRgb(selectedPalette[0]);
    const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    const textColor = brightness > 125 ? '#000000' : '#FFFFFF';

    setAiThumbnailBackground(gradient);
    setAiThumbnailTextColor(textColor);
  };

  const handleExport = (content, type) => {
    const filename = `youtube_content_${type}.txt`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
      alert('Failed to copy to clipboard.');
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateThumbnail = () => {
    let elementToCapture = null;
    let filenamePrefix = 'youtube_thumbnail';

    if (thumbnailMode === 'manual') {
      elementToCapture = document.getElementById('thumbnail-preview');
      // Temporarily hide Quill's toolbar if it's visible during capture
      const quillToolbar = elementToCapture ? elementToCapture.querySelector('.ql-toolbar') : null;
      if (quillToolbar) {
        quillToolbar.style.display = 'none';
      }
    } else if (thumbnailMode === 'ai-generated') {
      elementToCapture = document.getElementById('ai-thumbnail-preview');
      filenamePrefix = 'ai_youtube_thumbnail';
    }

    if (elementToCapture) {
      html2canvas(elementToCapture, { scale: 2 }).then(canvas => {
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = 1280;
        finalCanvas.height = 720;
        const ctx = finalCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, 1280, 720);

        finalCanvas.toBlob(function(blob) {
          saveAs(blob, `${filenamePrefix}.png`);
        }, 'image/png', 1);

        // Restore Quill's toolbar if it was hidden
        if (thumbnailMode === 'manual') {
          const quillToolbar = elementToCapture.querySelector('.ql-toolbar');
          if (quillToolbar) {
            quillToolbar.style.display = '';
          }
        }
      });
    } else {
      alert('Thumbnail preview element not found.');
    }
  };

  const thumbnailQuillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const thumbnailQuillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'color', 'background', 'align',
  ];

  useEffect(() => {
    if (videoTitle || generatedKeywords) {
      const initialText = `<h1>${videoTitle || ''}</h1><p>${generatedKeywords.split(',').slice(0, 3).join(' | ') || ''}</p>`;
      setThumbnailText(initialText);
    }
  }, [videoTitle, generatedKeywords]);

  return (
    <Container className="mt-4">
      <h2 className="mb-3">YouTube Content Generator</h2>

      <Row className="mb-3 align-items-end">
        <Col md={12}>
          <Form.Group>
            <Form.Label>Video Title (Speak or Type)</Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Speak your video title or type here..."
                className="me-2"
              />
              <Button
                variant={isListening ? 'danger' : 'outline-primary'}
                onClick={handleSpeakToggle}
                disabled={!isSpeechRecognitionReady}
              >
                {isListening ? <FaStop /> : <FaMicrophone />}
              </Button>
            </div>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Channel Name</Form.Label>
            <Form.Control type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="Your Channel Name" />
          </Form.Group>
        </Col>
      </Row>

      <hr className="my-4" />

      <Button onClick={generateContent} className="mb-4" disabled={!videoTitle} variant="primary">
        Generate YouTube Content
      </Button>

      {generatedDescription && (
        <div className="mb-4">
          <h4>Generated Description</h4>
          <Form.Control
            as="textarea"
            rows={6}
            value={generatedDescription}
            readOnly
            className="mb-2"
          />
          <Button variant="outline-primary" size="sm" onClick={() => copyToClipboard(generatedDescription)}>
            Copy Description
          </Button>
          <Button variant="outline-info" size="sm" className="ms-2" onClick={() => handleExport(generatedDescription, 'description')}>
            Export Description (.txt)
          </Button>
        </div>
      )}

      {generatedKeywords && (
        <div className="mb-4">
          <h4>Generated Keywords</h4>
          <Form.Control
            as="textarea"
            rows={3}
            value={generatedKeywords}
            readOnly
            className="mb-2"
          />
          <Button variant="outline-primary" size="sm" onClick={() => copyToClipboard(generatedKeywords)}>
            Copy Keywords
          </Button>
          <Button variant="outline-info" size="sm" className="ms-2" onClick={() => handleExport(generatedKeywords, 'keywords')}>
            Export Keywords (.txt)
          </Button>
        </div>
      )}

      <hr className="my-5" />

      <h3 className="mb-3">Thumbnail Generator (Basic)</h3>
      <Form.Group className="mb-3">
        <Form.Label>Thumbnail Generation Mode</Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            label="Manual Thumbnail"
            name="thumbnailMode"
            id="manualThumbnailMode"
            value="manual"
            checked={thumbnailMode === 'manual'}
            onChange={(e) => setThumbnailMode(e.target.value)}
          />
          <Form.Check
            inline
            type="radio"
            label="AI Generated Thumbnail"
            name="thumbnailMode"
            id="aiGeneratedThumbnailMode"
            value="ai-generated"
            checked={thumbnailMode === 'ai-generated'}
            onChange={(e) => setThumbnailMode(e.target.value)}
          />
        </div>
      </Form.Group>

      {thumbnailMode === 'manual' && (
        <>
          <Form.Group controlId="thumbnailImageUpload" className="mb-3">
            <Form.Label>Upload Background Image for Thumbnail (Optional)</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
          </Form.Group>

          <div className="mb-3">
            <Form.Label>Edit Thumbnail Text</Form.Label>
            <ReactQuill
              ref={thumbnailQuillRef}
              theme="snow"
              value={thumbnailText}
              onChange={setThumbnailText}
              modules={thumbnailQuillModules}
              formats={thumbnailQuillFormats}
              placeholder="Type your thumbnail text here..."
              style={{ height: '200px', marginBottom: '50px' }}
            />
          </div>

          <div className="mb-4 p-3 border rounded" style={{
            width: '1280px',
            height: '720px',
            backgroundColor: '#f0f0f0',
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: thumbnailImage ? `url(${thumbnailImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} id="thumbnail-preview">
            <div className="ql-editor" dangerouslySetInnerHTML={{ __html: thumbnailText }} style={{ width: '100%', height: '100%', background: 'transparent', color: thumbnailImage ? '#fff' : '#333', textShadow: thumbnailImage ? '2px 2px 4px rgba(0,0,0,0.7)' : 'none' }}>
            </div>
          </div>
        </>
      )}

      {thumbnailMode === 'ai-generated' && (
        <div className="mb-4 p-3 border rounded" style={{
          width: '1280px',
          height: '720px',
          background: aiThumbnailBackground,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Montserrat, sans-serif',
        }} id="ai-thumbnail-preview">
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy5wMy5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=)',
            opacity: 0.05,
          }}></div>
          <div style={{
            textAlign: 'center',
            color: aiThumbnailTextColor,
            textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
            background: 'rgba(0,0,0,0.2)',
            padding: '40px',
            borderRadius: '15px',
            maxWidth: '90%',
          }}>
            <h1 style={{ fontSize: '80px', fontWeight: 700, marginBottom: '20px' }}>{videoTitle || 'AI Generated Title'}</h1>
            <p style={{ fontSize: '40px', fontWeight: 400 }}>{generatedKeywords.split(',').slice(0, 3).join(' | ') || 'AI | Generated | Keywords'}</p>
          </div>
        </div>
      )}

      <Button variant="primary" onClick={handleGenerateThumbnail} disabled={!videoTitle} className="mb-4">
        Generate & Download Thumbnail
      </Button>

    </Container>
  );
}

export default YoutubeContentGenerator;
