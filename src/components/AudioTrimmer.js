import React, { useState, useRef } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { saveAs } from 'file-saver';

function AudioTrimmer() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
        setEndTime(audio.duration);
      };

      // Decode audio for trimming
      const reader = new FileReader();
      reader.onload = async (e) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        const arrayBuffer = e.target.result;
        audioContext.decodeAudioData(arrayBuffer, (buffer) => {
          audioBufferRef.current = buffer;
        }, (e) => console.error("Error decoding audio", e));
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleTrimAndDownload = () => {
    if (!audioBufferRef.current || startTime >= endTime || endTime > duration) {
      alert('Please upload an audio file and set valid start/end times.');
      return;
    }

    const audioContext = audioContextRef.current;
    const audioBuffer = audioBufferRef.current;

    const newBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      (endTime - startTime) * audioContext.sampleRate,
      audioContext.sampleRate
    );

    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
      const channelData = audioBuffer.getChannelData(i);
      const newChannelData = newBuffer.getChannelData(i);
      const startSample = Math.floor(startTime * audioContext.sampleRate);
      const endSample = Math.floor(endTime * audioContext.sampleRate);

      for (let j = startSample, k = 0; j < endSample; j++, k++) {
        newChannelData[k] = channelData[j];
      }
    }

    // Export to WAV (simple approach, might need more robust library for other formats)
    const wavBlob = audioBufferToWav(newBuffer);
    saveAs(wavBlob, `trimmed_${audioFile.name.split('.')[0]}.wav`);
  };

  // Helper function to convert AudioBuffer to WAV Blob (simplified)
  const audioBufferToWav = (buffer) => {
    const numOfChan = buffer.numberOfChannels,
      btwLength = buffer.length * numOfChan * 2 + 44,
      btwArrBuff = new ArrayBuffer(btwLength),
      btwView = new DataView(btwArrBuff),
      btwChnls = [],
      btwSampleRate = buffer.sampleRate,
      btwByteRate = btwSampleRate * numOfChan * 2,
      btwBlockAlign = numOfChan * 2,
      btwBitsPerSample = 16;

    for (let i = 0; i < numOfChan; i++) {
      btwChnls.push(buffer.getChannelData(i));
    }

    let offset = 0;
    /* RIFF identifier */
    writeString(btwView, offset, 'RIFF'); offset += 4;
    /* file length */
    btwView.setUint32(offset, btwLength - 8, true); offset += 4;
    /* RIFF type */
    writeString(btwView, offset, 'WAVE'); offset += 4;
    /* format chunk identifier */
    writeString(btwView, offset, 'fmt '); offset += 4;
    /* format chunk length */
    btwView.setUint32(offset, 16, true); offset += 4;
    /* sample format (raw) */
    btwView.setUint16(offset, 1, true); offset += 2;
    /* channel count */
    btwView.setUint16(offset, numOfChan, true); offset += 2;
    /* sample rate */
    btwView.setUint32(offset, btwSampleRate, true); offset += 4;
    /* byte rate (sample rate * block align) */
    btwView.setUint32(offset, btwByteRate, true); offset += 4;
    /* block align (channel count * bytes per sample) */
    btwView.setUint16(offset, btwBlockAlign, true); offset += 2;
    /* bits per sample */
    btwView.setUint16(offset, btwBitsPerSample, true); offset += 2;
    /* data chunk identifier */
    writeString(btwView, offset, 'data'); offset += 4;
    /* data chunk length */
    btwView.setUint32(offset, btwLength - offset - 4, true); offset += 4;

    for (let i = 0; i < buffer.length; i++) {
      for (let j = 0; j < numOfChan; j++) {
        btwView.setInt16(offset, btwChnls[j][i] * 0x7FFF, true); offset += 2;
      }
    }

    return new Blob([btwArrBuff], { type: 'audio/wav' });
  };

  const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Audio Trimmer</h1>
      <Row>
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <Form>
              <Form.Group controlId="audioUpload" className="mb-3">
                <Form.Label>Upload Audio File</Form.Label>
                <Form.Control type="file" accept="audio/*" onChange={handleAudioUpload} />
              </Form.Group>

              {audioUrl && (
                <div className="mb-3">
                  <audio controls src={audioUrl} className="w-100"></audio>
                  <p>Duration: {duration.toFixed(2)} seconds</p>
                </div>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Start Time (seconds)</Form.Label>
                <Form.Control
                  type="number"
                  value={startTime}
                  onChange={(e) => setStartTime(parseFloat(e.target.value))}
                  min={0}
                  max={duration}
                  step={0.01}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>End Time (seconds)</Form.Label>
                <Form.Control
                  type="number"
                  value={endTime}
                  onChange={(e) => setEndTime(parseFloat(e.target.value))}
                  min={0}
                  max={duration}
                  step={0.01}
                />
              </Form.Group>

              <Button variant="primary" onClick={handleTrimAndDownload} disabled={!audioFile}>
                Trim & Download Audio
              </Button>
            </Form>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm mt-3 mt-md-0">
            <Card.Body className="text-center">
              <Card.Title>Instructions</Card.Title>
              <p>Upload an audio file (e.g., MP3, WAV). Once loaded, you can specify the start and end times in seconds to trim the audio. The trimmed audio will be downloaded as a WAV file.</p>
              <p>Note: Audio processing is done in your browser. Large files may take some time to process.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AudioTrimmer;