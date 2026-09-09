import React, { useState, useRef, useEffect } from 'react';
import { Game, DogProfile, PlaySession } from '../types';
import { X, Video, Camera, StopCircle, RotateCcw, Share2, Sparkles, Check, Heart, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';
import { exportMedia } from '../lib/device';

interface Props {
  game: Game | null;
  dogProfile: DogProfile;
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: (session: PlaySession) => void;
  onUnlockSecretGame?: () => void;
}

const STICKERS = [
  { id: 'mvp', label: 'MVP Good Dog 🏆', badge: '10/10 Goodest Pup' },
  { id: 'zoomies', label: 'Zoomies ⚡', badge: 'SPEED: 9,000 RPM 🚀' },
  { id: 'brain', label: 'Brainiac 🧠', badge: 'Einstein Level IQ' },
  { id: 'sniff', label: 'Super Sniffer 👃', badge: '300M Receptors Locked' },
];

export const PlayCamModal: React.FC<Props> = ({
  game,
  dogProfile,
  isOpen,
  onClose,
  onSessionComplete,
  onUnlockSecretGame,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [activeSticker, setActiveSticker] = useState<string>('mvp');
  const [capturedMedia, setCapturedMedia] = useState<{ type: 'photo' | 'video'; url: string } | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingStarted = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let activeStream: MediaStream | null = null;
    if (!isOpen) {
      setStream(null);
      setCapturedMedia(null);
      setIsRecording(false);
      setRecordSeconds(0);
      setShareSuccess(false);
      return;
    }
    setCameraError(null);
    const openCamera = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          media.getTracks().forEach(track => track.stop());
          return;
        }
        activeStream = media;
        setStream(media);
        if (videoRef.current) videoRef.current.srcObject = media;
      } catch (error) {
        if (!cancelled) {
          setCameraError('Camera access is unavailable. Check app permissions in Settings, or upload a photo.');
        }
      }
    };
    void openCamera();
    return () => {
      cancelled = true;
      const recorder = mediaRecorderRef.current;
      if (recorder) {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        if (recorder.state !== 'inactive') recorder.stop();
      }
      mediaRecorderRef.current = null;
      activeStream?.getTracks().forEach(track => track.stop());
    };
  }, [isOpen]);

  useEffect(() => {
    if (!capturedMedia && stream && videoRef.current) videoRef.current.srcObject = stream;
    return () => {
      if (capturedMedia?.url.startsWith('blob:')) URL.revokeObjectURL(capturedMedia.url);
    };
  }, [capturedMedia, stream]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRecording) {
      timer = setInterval(() => {
        const seconds = Math.floor((Date.now() - recordingStarted.current) / 1000);
        setRecordSeconds(Math.min(60, seconds));
        if (seconds >= 60) handleStopRecording();
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    if (!stream?.active) {
      setCameraError('Enable camera access before recording, or upload a photo.');
      return;
    }

    try {
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream, { videoBitsPerSecond: 1_500_000 });
      let bytes = 0;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
          bytes += e.data.size;
          if (bytes > 15 * 1024 * 1024 && recorder.state === 'recording') recorder.stop();
        }
      };
      recorder.onstop = () => {
        setIsRecording(false);
        const blob = new Blob(recordedChunksRef.current, { type: recorder.mimeType });
        const videoUrl = URL.createObjectURL(blob);
        setCapturedMedia({ type: 'video', url: videoUrl });
      };
      recordingStarted.current = Date.now();
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordSeconds(0);
      soundFx.playWhistleStart();
    } catch (err) {
      console.error(err);
      setCameraError('Video recording is unavailable on this device. You can still take or upload a photo.');
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    soundFx.playFanfare();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleSaveSession = () => {
    if (!game) return;
    const session: PlaySession = {
      id: 'session-' + Date.now(),
      gameId: game.id,
      gameTitle: game.title,
      category: game.category,
      dogId: dogProfile.id,
      dogName: dogProfile.name,
      durationSeconds: recordSeconds,
      mode: 'video',
      timestamp: new Date().toISOString(),
      rating: 5,
    };
    onSessionComplete(session);
    onClose();
  };

  const handleTakeSnapshot = () => {
    const video = videoRef.current;
    if (!stream?.active || !video?.videoWidth) { setCameraError('The camera is not ready. Select a photo or check camera permissions.'); return; }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    setCapturedMedia({ type: 'photo', url: canvas.toDataURL('image/jpeg', .85) });
  };

  const handleSimulatedPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) {
      setCameraError('Choose a JPEG, PNG or WebP image smaller than 10 MB.'); return;
    }
    setCapturedMedia({ type: 'photo', url: URL.createObjectURL(file) });
    setCameraError(null);
  };

  const handleShareAndUnlock = async () => {
    if (!capturedMedia) return;
    try {
      const blob = await (await fetch(capturedMedia.url)).blob();
      const extension = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('png') ? 'png' : blob.type.includes('webp') ? 'webp' : capturedMedia.type === 'video' ? 'webm' : 'jpg';
      await exportMedia(blob, `play-moment.${extension}`, 'Our play moment');
      setShareSuccess(true);
    } catch { setCameraError('Export was cancelled or could not finish. Please try again.'); }
  };

  if (!isOpen || !game) return null;

  const currentSticker = STICKERS.find((s) => s.id === activeSticker);

  return (
    <div role="dialog" aria-modal="true" aria-label="Play Cam" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="play-cam-modal"
        className="relative w-full max-w-xl bg-stone-950 rounded-3xl shadow-2xl border border-stone-800 text-white overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="font-display font-bold text-base text-stone-100">
              {game.title} — Dog Play Cam
            </h3>
          </div>
          <button
            onClick={onClose} aria-label="Close"
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative aspect-4/3 w-full bg-stone-900 flex items-center justify-center overflow-hidden">
          {!capturedMedia ? (
            <>
              {/* Video preview from webcam */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* If camera error/permission, show charming fallback simulator */}
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-stone-900/90 backdrop-blur-xs space-y-3">
                  <div className="text-4xl">🐕📷</div>
                  <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5 max-w-sm">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Camera unavailable</span>
                  </div>
                  <p className="text-[11px] text-stone-300 max-w-xs leading-relaxed">
                    {cameraError}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <label className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs cursor-pointer transition-colors flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Pup Photo</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleSimulatedPhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Overlay AR Sticker on live feed */}
              {currentSticker && !cameraError && (
                <div className="absolute top-4 left-4 z-10 bg-amber-500/90 backdrop-blur-md text-stone-950 px-3 py-1.5 rounded-full text-xs font-black shadow-lg uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                  <span>{currentSticker.badge}</span>
                </div>
              )}

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 right-4 z-10 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>REC {recordSeconds}s</span>
                </div>
              )}
            </>
          ) : (
            /* Review captured photo or video */
            <div className="relative w-full h-full">
              {capturedMedia.type === 'video' && capturedMedia.url.startsWith('blob:') ? (
                <video
                  src={capturedMedia.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <img
                  src={capturedMedia.url}
                  alt={`${dogProfile.name} playing`}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Watermark badge on photo */}
              <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-500/30">
                🐾 {dogProfile.name} × {game.title}
              </div>
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="p-5 space-y-4">
          {capturedMedia && cameraError && <p role="status" className="text-sm text-amber-200">{cameraError}</p>}
          {!capturedMedia ? (
            <>
              {/* Sticker Selector */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Fun Overlay Stickers
                </span>
                <div className="flex flex-wrap gap-2">
                  {STICKERS.map((stk) => (
                    <button
                      key={stk.id}
                      type="button"
                      onClick={() => {
                        soundFx.playBoop(540);
                        setActiveSticker(stk.id);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                        activeSticker === stk.id
                          ? 'bg-amber-400 text-stone-950 scale-105 shadow-xs'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      {stk.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Capture Buttons */}
              <div className="flex items-center justify-center gap-4 pt-2">
                {!isRecording ? (
                  <>
                    <button
                      id="start-record-btn"
                      type="button"
                      onClick={handleStartRecording}
                      className="flex-1 py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Video className="w-4 h-4" />
                      <span>Record · up to 60s</span>
                    </button>

                    <button
                      id="snap-photo-btn"
                      type="button"
                      onClick={handleTakeSnapshot}
                      className="flex-1 py-3 px-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-stone-700"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Snap Photo</span>
                    </button>
                  </>
                ) : (
                  <button
                    id="stop-record-btn"
                    type="button"
                    onClick={handleStopRecording}
                    className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 animate-bounce transition-all shadow-lg"
                  >
                    <StopCircle className="w-5 h-5" />
                    <span>Stop Recording ({recordSeconds}s)</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Review & Virality Unlocks */
            <div className="space-y-4">
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-amber-300 text-xs sm:text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Keep this play moment
                  </h4>
                  <p className="text-[11px] text-amber-200/80 mt-0.5">
                    Save or share before closing. Photos and silent videos stay private and are not included in cloud history. Stickers are preview decorations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleShareAndUnlock}
                  className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{shareSuccess ? 'Export again' : 'Save / Share'}</span>
                </button>
              </div>

              {shareSuccess && (
                <div className="bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 p-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Export finished. Activity history stores the session details only.</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCapturedMedia(null)}
                  className="py-3 px-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake</span>
                </button>

                <button
                  id="save-cam-session-btn"
                  type="button"
                  onClick={handleSaveSession}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
                >
                  <Heart className="w-4 h-4 fill-stone-950" />
                  <span>Save to {dogProfile.name}'s Activity Tally</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
