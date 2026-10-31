import React, { useState, useRef, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, ButtonGroup, Form } from "react-bootstrap";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";

const TONE_PRESETS = [
  { hz: 174, note: "Pain & tension relief" },
  { hz: 285, note: "Healing & renewal" },
  { hz: 396, note: "Release worry" },
  { hz: 417, note: "Let go of stress" },
  { hz: 432, note: "Natural calm" },
  { hz: 528, note: "Positivity" },
  { hz: 639, note: "Connection" },
  { hz: 741, note: "Clear thinking" },
  { hz: 852, note: "Inner peace" },
  { hz: 963, note: "Deep calm" },
];

const BINAURAL_PRESETS = [
  { key: "delta", label: "Delta — Deep Rest", beat: 2, note: "Winding down" },
  { key: "theta", label: "Theta — Deep Relax", beat: 6, note: "Dreamy calm" },
  { key: "alpha", label: "Alpha — Relaxed Focus", beat: 10, note: "Calm & alert" },
  { key: "beta", label: "Beta — Gentle Focus", beat: 18, note: "Light focus" },
];

const NOISE_TYPES = [
  { key: "white", label: "White Noise" },
  { key: "pink", label: "Pink Noise" },
  { key: "brown", label: "Brown Noise" },
];

const TIMER_OPTIONS = [0, 5, 10, 15, 20, 30]; // minutes; 0 = no limit
const CARRIER_HZ = 200; // comfortable base tone for binaural beats
const WAVE_TYPES = ["sine", "triangle", "square"];

// Precomputes a short loopable noise buffer. A static buffer is simpler and
// more reliably cross-browser than a real-time ScriptProcessor/Worklet, and
// a brief loop seam is inaudible for unstructured noise like this.
function buildNoiseBuffer(ctx, type, seconds = 6) {
  const frameCount = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (type === "pink") {
    // Paul Kellet's refined pink noise approximation.
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < frameCount; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  } else if (type === "brown") {
    let lastOut = 0;
    for (let i = 0; i < frameCount; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }
  } else {
    for (let i = 0; i < frameCount; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  return buffer;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function MindRelaxSounds() {
  const [mode, setMode] = useState("tone"); // 'tone' | 'binaural' | 'noise'
  const [toneHz, setToneHz] = useState(432);
  const [waveType, setWaveType] = useState("sine");
  const [binauralKey, setBinauralKey] = useState("alpha");
  const [noiseType, setNoiseType] = useState("pink");
  const [volume, setVolume] = useState(40);
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(null);

  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const activeNodesRef = useRef([]);
  const timerTimeoutRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const clearTimers = useCallback(() => {
    window.clearTimeout(timerTimeoutRef.current);
    window.clearInterval(countdownIntervalRef.current);
    timerTimeoutRef.current = null;
    countdownIntervalRef.current = null;
  }, []);

  const stopActiveNodes = useCallback(() => {
    activeNodesRef.current.forEach((node) => {
      try {
        node.stop();
      } catch (err) {
        // already stopped — ignore
      }
    });
    activeNodesRef.current = [];
  }, []);

  const handleStop = useCallback(() => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (ctx && masterGain) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
    }
    window.setTimeout(stopActiveNodes, 200);
    clearTimers();
    setIsPlaying(false);
    setSecondsLeft(null);
  }, [stopActiveNodes, clearTimers]);

  const handlePlay = useCallback(() => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      alert("Sorry, your browser doesn't support audio playback.");
      return;
    }

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    stopActiveNodes();

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    if (mode === "tone") {
      const osc = ctx.createOscillator();
      osc.type = waveType;
      osc.frequency.value = toneHz;
      osc.connect(masterGain);
      osc.start();
      activeNodesRef.current.push(osc);
    } else if (mode === "binaural") {
      const preset = BINAURAL_PRESETS.find((p) => p.key === binauralKey) || BINAURAL_PRESETS[0];
      const oscLeft = ctx.createOscillator();
      const oscRight = ctx.createOscillator();
      oscLeft.type = "sine";
      oscRight.type = "sine";
      oscLeft.frequency.value = CARRIER_HZ;
      oscRight.frequency.value = CARRIER_HZ + preset.beat;

      const panLeft = ctx.createStereoPanner();
      const panRight = ctx.createStereoPanner();
      panLeft.pan.value = -1;
      panRight.pan.value = 1;

      oscLeft.connect(panLeft).connect(masterGain);
      oscRight.connect(panRight).connect(masterGain);
      oscLeft.start();
      oscRight.start();
      activeNodesRef.current.push(oscLeft, oscRight);
    } else if (mode === "noise") {
      const source = ctx.createBufferSource();
      source.buffer = buildNoiseBuffer(ctx, noiseType);
      source.loop = true;
      source.connect(masterGain);
      source.start();
      activeNodesRef.current.push(source);
    }

    masterGain.gain.setTargetAtTime(volume / 100, ctx.currentTime, 0.3);
    setIsPlaying(true);

    clearTimers();
    if (timerMinutes > 0) {
      setSecondsLeft(timerMinutes * 60);
      countdownIntervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
      timerTimeoutRef.current = window.setTimeout(handleStop, timerMinutes * 60 * 1000);
    } else {
      setSecondsLeft(null);
    }
  }, [mode, toneHz, waveType, binauralKey, noiseType, volume, timerMinutes, stopActiveNodes, clearTimers, handleStop]);

  // Live volume updates while a session is already running.
  useEffect(() => {
    if (isPlaying && masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(volume / 100, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume, isPlaying]);

  // Switching mode or a preset while a session is running restarts it with
  // the new settings instead of requiring a manual stop/play.
  useEffect(() => {
    if (isPlaying) {
      handlePlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, toneHz, waveType, binauralKey, noiseType]);

  useEffect(() => {
    return () => {
      clearTimers();
      stopActiveNodes();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [clearTimers, stopActiveNodes]);

  const activePreset = BINAURAL_PRESETS.find((p) => p.key === binauralKey);

  return (
    <Container className="my-5" style={{ maxWidth: "900px" }}>
      <div className="text-center mb-4">
        <h1 className="mb-2">Mind Relax — Brain Rest Sounds</h1>
        <p className="text-muted">
          Calming tones, binaural beats, and soft noise for a peaceful break — great for kids
          (and grown-ups) to reset. Headphones recommended, especially for Binaural Beats.
        </p>
      </div>

      <Card className="shadow-sm p-4 mb-4" style={{ backgroundColor: "#f3f8fb" }}>
        <div className="d-flex justify-content-center mb-3">
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8ec5fc, #e0c3fc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: isPlaying ? "mindRelaxBreathe 8s ease-in-out infinite" : "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            }}
          >
            <Button
              variant="light"
              onClick={() => (isPlaying ? handleStop() : handlePlay())}
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
                border: "none",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              }}
              aria-label={isPlaying ? "Stop" : "Play"}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </Button>
          </div>
        </div>

        {secondsLeft !== null && (
          <p className="text-center text-muted mb-3">
            Session ends in <strong>{formatTime(secondsLeft)}</strong>
          </p>
        )}

        <Row className="justify-content-center mb-4">
          <Col xs="auto">
            <ButtonGroup>
              {[
                { key: "tone", label: "Pure Tone" },
                { key: "binaural", label: "Binaural Beats" },
                { key: "noise", label: "Calming Noise" },
              ].map((m) => (
                <Button
                  key={m.key}
                  variant={mode === m.key ? "primary" : "outline-primary"}
                  style={
                    mode === m.key
                      ? { backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)" }
                      : {}
                  }
                  onClick={() => setMode(m.key)}
                >
                  {m.label}
                </Button>
              ))}
            </ButtonGroup>
          </Col>
        </Row>

        {mode === "tone" && (
          <>
            <Form.Label className="d-block text-center">Choose a Frequency</Form.Label>
            <Row className="g-2 justify-content-center mb-3">
              {TONE_PRESETS.map((preset) => (
                <Col xs={6} sm={4} md={3} key={preset.hz}>
                  <Button
                    className="w-100"
                    size="sm"
                    variant={toneHz === preset.hz ? "primary" : "outline-secondary"}
                    style={
                      toneHz === preset.hz
                        ? { backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)" }
                        : {}
                    }
                    onClick={() => setToneHz(preset.hz)}
                  >
                    {preset.hz} Hz
                    <br />
                    <small style={{ opacity: 0.85 }}>{preset.note}</small>
                  </Button>
                </Col>
              ))}
            </Row>
            <Form.Group className="mb-2 text-center">
              <Form.Label className="d-block">Tone Shape</Form.Label>
              {WAVE_TYPES.map((type) => (
                <Button
                  key={type}
                  size="sm"
                  className="me-2"
                  variant={waveType === type ? "secondary" : "outline-secondary"}
                  onClick={() => setWaveType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </Form.Group>
          </>
        )}

        {mode === "binaural" && (
          <>
            <Form.Label className="d-block text-center">Choose a Relaxation Preset</Form.Label>
            <Row className="g-2 justify-content-center mb-2">
              {BINAURAL_PRESETS.map((preset) => (
                <Col xs={6} sm={3} key={preset.key}>
                  <Button
                    className="w-100"
                    size="sm"
                    variant={binauralKey === preset.key ? "primary" : "outline-secondary"}
                    style={
                      binauralKey === preset.key
                        ? { backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)" }
                        : {}
                    }
                    onClick={() => setBinauralKey(preset.key)}
                  >
                    {preset.label}
                    <br />
                    <small style={{ opacity: 0.85 }}>{preset.note}</small>
                  </Button>
                </Col>
              ))}
            </Row>
            <p className="text-center text-muted small mb-1">
              🎧 Headphones required — a slightly different tone plays in each ear
              {activePreset ? ` (${CARRIER_HZ} Hz / ${CARRIER_HZ + activePreset.beat} Hz)` : ""}.
            </p>
          </>
        )}

        {mode === "noise" && (
          <Row className="g-2 justify-content-center mb-3">
            {NOISE_TYPES.map((n) => (
              <Col xs={4} key={n.key}>
                <Button
                  className="w-100"
                  variant={noiseType === n.key ? "primary" : "outline-secondary"}
                  style={
                    noiseType === n.key
                      ? { backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)" }
                      : {}
                  }
                  onClick={() => setNoiseType(n.key)}
                >
                  {n.label}
                </Button>
              </Col>
            ))}
          </Row>
        )}

        <Row className="align-items-start mt-4">
          <Col md={6} className="mb-3 mb-md-0">
            <Form.Label className="d-flex align-items-center gap-2">
              <FaVolumeUp className="me-2" /> Volume
            </Form.Label>
            <Form.Range min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
          </Col>
          <Col md={6}>
            <Form.Label className="d-block">Session Timer</Form.Label>
            <div>
              {TIMER_OPTIONS.map((min) => (
                <Button
                  key={min}
                  size="sm"
                  className="me-2 mb-2"
                  variant={timerMinutes === min ? "secondary" : "outline-secondary"}
                  onClick={() => setTimerMinutes(min)}
                >
                  {min === 0 ? "No limit" : `${min} min`}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
      </Card>

      <p className="text-muted small text-center">
        For relaxation and fun only — not a medical device, and it doesn't diagnose, treat, or
        cure anything. If a child (or anyone) feels dizzy or uncomfortable, stop and take a break.
      </p>

      <style>{`
        @keyframes mindRelaxBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </Container>
  );
}

export default MindRelaxSounds;
