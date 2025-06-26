"use client";
import { useScreenRecording } from "@/lib/hooks/useScreenRecording";
import { Upload, Video, VideoIcon, VideoOff, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const RecordScreen = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    startRecording,
    stopRecording,
    resetRecording,
    recordedBlob,
    recordedVideoUrl,
    recordingDuration,
    isRecording,
  } = useScreenRecording();

  const closeModal = () => {
    resetRecording();
    setIsOpen(false);
  };

  const handleStart = async () => {
    await startRecording();
  };

  const recordAgain = async () => {
    resetRecording();
    await startRecording();
    if (recordedVideoUrl && videoRef.current) {
      videoRef.current.src = recordedVideoUrl;
    }
  };

  const goToUpload = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    sessionStorage.setItem(
      "recordedVideo",
      JSON.stringify({
        url,
        name: "screen-recording.webm",
        size: recordedBlob.size,
        duration: recordingDuration || 0,
      })
    );
    router.push("/upload");
    closeModal();
  };

  return (
    <div className="record">
      <button
        className="primary-btn flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base rounded-full bg-pink-500 text-white w-full sm:w-auto"
        onClick={() => setIsOpen(true)}
      >
        <Video className="h-5 w-5" />
        <span className="truncate">Record Video</span>
      </button>
      {isOpen && (
        <section className="dialog">
          <div className="overlay-record" onClick={closeModal} />
          <div className="dialog-content">
            <figure>
              <h3>Screen Recording</h3>
              <button onClick={closeModal}>
                <X className="h-5 w-5 text-red-500" />
              </button>
            </figure>
            <section>
              {isRecording ? (
                <article>
                  <span>Recording in progress...</span>
                </article>
              ) : recordedVideoUrl ? (
                <video ref={videoRef} src={recordedVideoUrl} controls />
              ) : (
                <p>Click to start recording</p>
              )}
            </section>
            <div className="record-box">
              {!isRecording && !recordedVideoUrl && (
                <button onClick={handleStart} className="record-start">
                  <VideoIcon />
                  Record
                </button>
              )}
              {isRecording && (
                <button onClick={stopRecording} className="record-stop">
                  <VideoOff />
                  Stop Recording
                </button>
              )}
              {recordedVideoUrl && (
                <>
                  <button className="record-again" onClick={recordAgain}>
                    <VideoIcon />
                    Record Again
                  </button>
                  <button className="record-upload" onClick={goToUpload}>
                    <Upload />
                    Continue to upload
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RecordScreen;
