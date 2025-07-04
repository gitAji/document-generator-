import React, { useState, useRef } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import mammoth from 'mammoth';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js`;

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js`;


function DocumentUploadEditor() {
  const [editorContent, setEditorContent] = useState('');
  const [fileName, setFileName] = useState('');
  const quillRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;

      if (file.name.endsWith('.docx')) {
        try {
          const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
          setEditorContent(result.value);
        } catch (error) {
          console.error('Error converting docx:', error);
          alert('Error converting .docx file. Please try again or upload a .txt file.');
          setEditorContent('');
        }
      } else if (file.name.endsWith('.txt')) {
        const textContent = new TextDecoder('utf-8').decode(arrayBuffer);
        setEditorContent(textContent);
      } else if (file.type === 'application/pdf') {
        try {
          const pdfData = new Uint8Array(arrayBuffer);
          const loadingTask = pdfjsLib.getDocument({ data: pdfData });
          const pdf = await loadingTask.promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map(item => item.str).join(' ') + '\n';
          }
          setEditorContent(fullText);
        } catch (error) {
          console.error('Error processing PDF:', error);
          alert(`Error processing PDF file: ${error.message}. Please try again or upload a different file.`);
          setEditorContent('');
        }
      } else {
        alert('Unsupported file type. Please upload a .docx, .txt, or .pdf file.');
        setEditorContent('');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExport = (type) => {
    const currentContent = quillRef.current.getEditor().getText(); // Get plain text for .txt and .pdf
    const currentHtml = quillRef.current.getEditor().root.innerHTML; // Get HTML for potential .docx conversion

    const baseFilename = fileName.split('.')[0] || 'document';
    const exportFilename = `${baseFilename}.${type}`;

    if (type === 'txt') {
      const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, exportFilename);
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
          pdf.save(exportFilename);
        });
      } else {
        alert('Editor content not available for PDF export.');
      }
    } else if (type === 'docx') {
      // Client-side .docx generation from arbitrary HTML is complex and often limited.
      // For a robust solution, a server-side conversion or a more sophisticated client-side library
      // that can handle HTML to DOCX conversion with full fidelity would be required.
      // This is a very basic placeholder that will likely not preserve complex formatting.
      alert('Basic .docx export. Complex formatting may not be preserved. For full fidelity, a server-side solution is recommended.');
      const blob = new Blob([currentHtml], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, exportFilename);
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
      <h2 className="mb-3">Upload & Edit Document</h2>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Upload .docx, .txt or .pdf file</Form.Label>
        <Form.Control type="file" accept=".docx,.txt,.pdf" onChange={handleFileUpload} />
      </Form.Group>

      {fileName && <p>Editing: {fileName}</p>}

      <div className="mb-3">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={editorContent}
          onChange={setEditorContent}
          modules={modules}
          formats={formats}
          placeholder="Upload a document or type here..."
          style={{ height: '600px' }}
        />
      </div>

      <div className="mb-3 mt-5">
        <Button variant="primary" className="me-2" onClick={() => handleExport('txt')}>
          Export as .txt
        </Button>
        <Button variant="primary" className="me-2" onClick={() => handleExport('pdf')}>
          Export as .pdf
        </Button>
        <Button variant="secondary" onClick={() => handleExport('docx')}>
          Export as .docx (Basic) 
        </Button>
      </div>
    </Container>
  );
}

export default DocumentUploadEditor;
