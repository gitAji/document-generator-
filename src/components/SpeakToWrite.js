import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Dropdown } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FaMicrophone, FaStop } from 'react-icons/fa';

// Dummy templates for demonstration
const templates = {
  'CV / Resume': {
    'Basic CV': "<p>[Your Name]</p><p>[Your Contact Information]</p><p><br></p><p><strong>Summary:</strong></p><p>[A brief summary of your professional experience and career goals.]</p><p><br></p><p><strong>Experience:</strong></p><p>[Job Title], [Company Name], [Dates]</p><ul><li>[Responsibility 1]</li><li>[Responsibility 2]</li></ul><p><br></p><p><strong>Education:</strong></p><p>[Degree], [University Name], [Graduation Year]</p><p><br></p><p><strong>Skills:</strong></p><p>[List of relevant skills]</p>",
    'Modern Resume': "<p>[Name Surname]</p><p>[Phone] | [Email] | [LinkedIn]</p><p><br></p><p><strong>Profile</strong></p><p>[Concise overview of your professional background and aspirations.]</p><p><br></p><p><strong>Work Experience</strong></p><p>[Position], [Company] | [Start Date] – [End Date]</p><ul><li>[Key achievement 1]</li><li>[Key achievement 2]</li></ul><p><br></p><p><strong>Education</strong></p><p>[Degree], [Institution] | [Year]</p><p><br></p><p><strong>Skills</strong></p><p>[Technical Skills], [Soft Skills]</p>"
  },
  'Letter': {
    'Formal Letter': "<p>[Your Name]</p><p>[Your Address]</p><p>[Your City, Postal Code]</p><p>[Date]</p><p><br></p><p>[Recipient Name]</p><p>[Recipient Address]</p><p>[Recipient City, Postal Code]</p><p><br></p><p>Dear [Recipient Name],</p><p><br></p><p>[Body of the letter]</p><p><br></p><p>Sincerely,</p><p>[Your Name]</p>",
    'Informal Letter': "<p>Hi [Recipient Name],</p><p><br></p><p>Hope you're doing well.</p><p><br></p><p>[Body of the letter]</p><p><br></p><p>Best,</p><p>[Your Name]</p>"
  },
  'Email': {
    'Professional Email': "<p><strong>Subject:</strong> [Your Subject]</p><p><br></p><p>Dear [Recipient Name],</p><p><br></p><p>[Body of the email]</p><p><br></p><p>Regards,</p><p>[Your Name]</p>",
    'Casual Email': "<p><strong>Subject:</strong> [Your Subject]</p><p><br></p><p>Hey [Recipient Name],</p><p><br></p><p>[Body of the email]</p><p><br></p><p>Talk soon,</p><p>[Your Name]</p>"
  },
  'Report': {
    'Standard Report': "<p><strong>Title:</strong> [Report Title]</p><p><strong>Date:</strong> [Date]</p><p><strong>Author:</strong> [Author Name]</p><p><br></p><p><strong>Introduction:</strong></p><p>[Brief introduction to the report.]</p><p><br></p><p><strong>Body:</strong></p><p>[Main content of the report.]</p><p><br></p><p><strong>Conclusion:</strong></p><p>[Summary and concluding remarks.]</p>"
  },
  'Others': {
    'Blank Document': ""
  }
};

function SpeakToWrite() {
  const [documentType, setDocumentType] = useState('Others');
  const [editorContent, setEditorContent] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeechRecognitionReady, setIsSpeechRecognitionReady] = useState(false);
  const recognitionRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    let recognitionInstance = null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          // Remove newline characters to ensure text stays in a paragraph
          finalTranscript = finalTranscript.replace(/\n/g, ' ').trim();
          setEditorContent((prevContent) => prevContent + (prevContent ? ' ' : '') + finalTranscript);
        }
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
      console.log('SpeechRecognition instance created:', recognitionRef.current);
    } else {
      console.warn('Speech Recognition API not supported in this browser.');
      setIsSpeechRecognitionReady(false);
    }

    // Check if recognitionRef.current is set after the effect runs
    console.log('recognitionRef.current after useEffect:', recognitionRef.current);

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
      setEditorContent(''); // Clear previous content
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        console.warn('Speech Recognition API not available.');
      }
    }
  };

  const handleTemplateSelect = (templateContent) => {
    setEditorContent(templateContent);
  };

  const handleExport = (type) => {
    const filename = `document.${type}`;
    const content = quillRef.current.getEditor().getText(); // Get plain text from Quill

    if (type === 'txt') {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, filename);
    } else if (type === 'pdf') {
      if (quillRef.current) {
        const editorElement = quillRef.current.getEditor().root;
        html2canvas(editorElement).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
          });
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save(filename);
        });
      } else {
        alert('Editor content not available for PDF export.');
      }
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image', 'video'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'color', 'background', 'align',
  ];

  return (
    <Container className="mt-4">
      <div className="mb-3 d-flex align-items-center flex-wrap">
        <Dropdown onSelect={(eventKey) => setDocumentType(eventKey)} className="me-2 mb-2">
          <Dropdown.Toggle variant="primary" id="dropdown-document-type">
            Document Type: {documentType}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.keys(templates).map((type) => (
              <Dropdown.Item key={type} eventKey={type}>{type}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        {documentType !== 'Others' && templates[documentType] && (
          <Dropdown className="me-2 mb-2">
            <Dropdown.Toggle variant="secondary" id="dropdown-template">
              Select Template
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.keys(templates[documentType]).map((templateName) => (
                <Dropdown.Item
                  key={templateName}
                  onClick={() => handleTemplateSelect(templates[documentType][templateName])}
                >
                  {templateName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}

        <Button
          variant={isListening ? 'danger' : 'primary'}
          onClick={handleSpeakToggle}
          disabled={!isSpeechRecognitionReady}
          className="d-flex align-items-center px-4 py-2 ms-auto mb-2"
        >
          {isListening ? <><FaStop className="me-2" /> Stop Speaking</> : <><FaMicrophone className="me-2" /> Speak to Write</>}
        </Button>
      </div>

      <div className="mb-3">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={editorContent}
          onChange={setEditorContent}
          modules={modules}
          formats={formats}
          placeholder="Start speaking or type here..."
          style={{ height: '600px' }}
        />
      </div>

      <div className="mb-3 mt-5">
        <Button style={{ backgroundColor: 'var(--primary-color)', color: 'var(--background-color)' }} variant="primary" className="me-2" onClick={() => handleExport('txt')}>
          Export as .txt
        </Button>
        <Button style={{ backgroundColor: 'var(--primary-color)', color: 'var(--background-color)' }} variant="primary" onClick={() => handleExport('pdf')}>
          Export as .pdf
        </Button>
      </div>
    </Container>
  );
}

export default SpeakToWrite;
