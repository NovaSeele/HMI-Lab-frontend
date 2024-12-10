import { useState, useRef, useEffect } from "react";

const Recorder = ({ setTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const [silenceTimeout, setSilenceTimeout] = useState(null);
  const recognitionRef = useRef(null);
  const audioStartTime = useRef(Date.now());

  // Start/Stop Recording Logic
  const handleStartRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Your browser does not support speech recognition.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.continuous = true; // Allow continuous recognition

    recognitionRef.current.onstart = () => {
      setIsRecording(true);
      setError("");
      audioStartTime.current = Date.now();
      startSilenceTimer(); // Start silence detection timer
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscription(transcript);
      audioStartTime.current = Date.now(); // Update time on voice detection
    };

    recognitionRef.current.onerror = (event) => {
      setError(`Error occurred: ${event.error}`);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      stopSilenceTimer(); // Stop silence detection timer
    };

    recognitionRef.current.start();
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      stopSilenceTimer(); // Stop silence detection timer
    }
  };

  // Handle silence timeout (auto stop after 5 seconds of silence)
  const startSilenceTimer = () => {
    if (silenceTimeout) clearTimeout(silenceTimeout); // Clear existing timeout
    setSilenceTimeout(
      setTimeout(() => {
        handleStopRecording();
        setError("No voice detected, automatically stop transcribing.");
      }, 5000) // 5 seconds of silence
    );
  };

  const stopSilenceTimer = () => {
    if (silenceTimeout) clearTimeout(silenceTimeout);
    setSilenceTimeout(null);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (silenceTimeout) clearTimeout(silenceTimeout);
    };
  }, [silenceTimeout]);

  // SVG Button for Start/Stop
  const startStopButton = isRecording ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-red-500 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      onClick={handleStopRecording}
    >
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12 text-green-500 cursor-pointer"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      onClick={handleStartRecording}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 3l14 9-14 9V3z"
      />
    </svg>
  );

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold mb-4">Audio to Text Converter</h1>
      <div className="flex justify-center mb-4">{startStopButton}</div>
      {error && (
        <div className="text-red-500 mt-2">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Recorder;
