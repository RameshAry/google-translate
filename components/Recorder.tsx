"use client";

import { MicIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export const mimeType = "audio/webm";

function Recorder({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const getMicroPhonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (e: any) {
        alert("Your browser does not support the MediaRecorder permission");
      }
    }
  };

  const startRecording = async () => {
    if (stream === null) return;

    setRecordingStatus("recording");

    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localAudioChunk: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunk.push(event.data);
    };

    setAudioChunks(localAudioChunk);
  };
  const stopRecording = async () => {
    if (mediaRecorder.current === null) return;

    setRecordingStatus("inactive");
    mediaRecorder.current.stop();

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      uploadAudio(audioBlob);
      setAudioChunks([]);
    };
  };

  useEffect(() => {
    getMicroPhonePermission();
  }, []);
  return (
    <div
      className={`flex items-center group text-blue-500 cursor-pointer border rounded-md w-fit px-3 py-2 mb-5 ${
        recordingStatus === "recording"
          ? "bg-red-500 text-white"
          : "hover:bg-[#E7F0FE]"
      }`}
    >
      <MicIcon size={20} className="group-hover:underline" />
      {!permission && (
        <button onClick={getMicroPhonePermission}>Get Microphone</button>
      )}

      {permission && recordingStatus === "inactive" && (
        <button
          onClick={startRecording}
          className="text-sm font-medium group-hover:underline ml-2 mt-1"
        >
          Speak
        </button>
      )}

      {permission && recordingStatus === "recording" && (
        <button
          onClick={stopRecording}
          className="text-sm font-medium group-hover:underline ml-2 mt-1"
        >
          Stop Recording
        </button>
      )}
    </div>
  );
}

export default Recorder;
