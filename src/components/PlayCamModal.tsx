import React, { useState, useRef, useEffect } from 'react';
import { Game, DogProfile, PlaySession } from '../types';
import { X, Video, Camera, StopCircle, RotateCcw, Share2, Sparkles, Check, Heart, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/audio';

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

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedMedia(null);
      setIsRecording(false);
      setRecordSeconds(0);
      setShareSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }
    } catch (err) {
      console.warn('Camera access unavailable or declined:', err);
      setCameraError('Camera access not available in this preview iframe. You can still test with simulated dog snapshots or upload your own!');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const handleStartRecording = () => {
    if (!stream) {
      // Simulate recording if no physical camera
      setIsRecording(true);
      setRecordSeconds(0);
      soundFx.playWhistleStart();
      return;
    }

    try {
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setCapturedMedia({ type: 'video', url: videoUrl });
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordSeconds(0);
      soundFx.playWhistleStart();
    } catch (err) {
      console.error(err);
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    soundFx.playFanfare();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else if (!capturedMedia) {
      // Fallback preview
      setCapturedMedia({
        type: 'video',
        url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop',
      });
    }
  };

  const handleTakeSnapshot = () => {
    soundFx.playBoop(750);
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const photoUrl = canvas.toDataURL('image/jpeg');
        setCapturedMedia({ type: 'photo', url: photoUrl });
        soundFx.playFanfare();
        confetti({ particleCount: 50, spread: 50 });
        return;
      }
    }
    // Fallback cute snapshot
    setCapturedMedia({
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop',
    });
    soundFx.playFanfare();
    confetti({ particleCount: 50, spread: 50 });
  };

  const handleSimulatedPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setCapturedMedia({ type: 'photo', url: reader.result as string });
          soundFx.playFanfare();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareAndUnlock = () => {
    soundFx.playFanfare();
    setShareSuccess(true);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
    if (onUnlockSecretGame) {
      onUnlockSecretGame();
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
      durationSeconds: recordSeconds > 0 ? recordSeconds : 90,
      mode: 'video',
      timestamp: new Date().toISOString(),
      photoOrVideoUrl: capturedMedia?.url,
      rating: 5,
    };
    onSessionComplete(session);
    onClose();
  };

  if (!isOpen || !game) return null;

  const currentSticker = STICKERS.find((s) => s.id === activeSticker);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
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
            onClick={onClose}
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
                    <span>Live camera preview blocked by sandbox</span>
                  </div>
                  <p className="text-[11px] text-stone-300 max-w-xs leading-relaxed">
                    You can snap a demo puppy photo or upload your real dog picture to record this session and unlock viral rewards!
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <label className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs cursor-pointer transition-colors flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Pup Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSimulatedPhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleTakeSnapshot}
                      className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition-colors"
                    >
                      Use Demo Photo
                    </button>
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
              {capturedMedia.type === 'video' && capturedMedia.url.endsWith('.webm') ? (
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
                      <span>Record Video</span>
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
                    Share This Moment to Unlock Secret Games!
                  </h4>
                  <p className="text-[11px] text-amber-200/80 mt-0.5">
                    Show the world {dogProfile.name} in action and unlock "The Magic Sheet Ghost Tunnel"!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleShareAndUnlock}
                  className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{shareSuccess ? 'Shared! 🎉' : 'Share & Unlock'}</span>
                </button>
              </div>

              {shareSuccess && (
                <div className="bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 p-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Unlocked! Bonus games are now active in your game catalog!</span>
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
