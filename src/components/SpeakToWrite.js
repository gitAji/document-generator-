import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Dropdown } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Dummy templates for demonstration
const templates = {
  'CV / Resume': {
    'Basic CV': "[Your Name]\n[Your Contact Information]\n\nSummary:\n[A brief summary of your professional experience and career goals.]\n\nExperience:\n[Job Title], [Company Name], [Dates]\n- [Responsibility 1]\n- [Responsibility 2]\n\nEducation:\n[Degree], [University Name], [Graduation Year]\n\nSkills:\n[List of relevant skills]\n",
    'Modern Resume': "[Name Surname]\n[Phone] | [Email] | [LinkedIn]\n\nProfile\n[Concise overview of your professional background and aspirations.]\n\nWork Experience\n[Position], [Company] | [Start Date] – [End Date]\n- [Key achievement 1]\n- [Key achievement 2]\n\nEducation\n[Degree], [Institution] | [Year]\n\nSkills\n[Technical Skills], [Soft Skills]\n"
  },
  'Letter': {
    'Formal Letter': "[Your Name]\n[Your Address]\n[Your City, Postal Code]\n[Date]\n\n[Recipient Name]\n[Recipient Address]\n[Recipient City, Postal Code]\n\nDear [Recipient Name],\n\n[Body of the letter]\n\nSincerely,\n[Your Name]\n",
    'Informal Letter': "Hi [Recipient Name],\n\nHope you're doing well.\n\n[Body of the letter]\n\nBest,\n[Your Name]\n"
  },
  'Email': {
    'Professional Email': "Subject: [Your Subject]\n\nDear [Recipient Name],\n\n[Body of the email]\n\nRegards,\n[Your Name]\n",
    'Casual Email': "Subject: [Your Subject]\n\nHey [Recipient Name],\n\n[Body of the email]\n\nTalk soon,\n[Your Name]\n"
  },
  'Report': {
    'Standard Report': "Title: [Report Title]\nDate: [Date]\nAuthor: [Author Name]\n\nIntroduction:\n[Brief introduction to the report.]\n\nBody:\n[Main content of the report.]\n\nConclusion:\n[Summary and concluding remarks.]\n"
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
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <Container className="mt-4">
      <div className="mb-3">
        <Dropdown onSelect={(eventKey) => setDocumentType(eventKey)} className="me-2">
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
          <Dropdown className="me-2">
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
          variant={isListening ? 'danger' : 'success'}
          onClick={handleSpeakToggle}
          disabled={!isSpeechRecognitionReady}
        >
          {isListening ? 'Stop Speaking' : 'Speak'}
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
        <Button variant="info" className="me-2" onClick={() => handleExport('txt')}>
          Export as .txt
        </Button>
        <Button variant="info" onClick={() => handleExport('pdf')}>
          Export as .pdf
        </Button>
      </div>
    </Container>
  );
}

export default SpeakToWrite;
