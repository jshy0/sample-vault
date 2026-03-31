import { useState, useRef, useEffect } from "react";
import { usePlayerStore } from "@/store/playerStore";

export function useSamplePlayer() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volume = usePlayerStore((s) => s.volume);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  async function handlePlayPause(id: string, fileUrl: string) {
    setPlayError(null);
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    if (!fileUrl) {
      setPlayError("No audio file available for this sample.");
      return;
    }
    const audio = new Audio(fileUrl);
    audio.volume = volume;
    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    try {
      await audio.play();
      setPlayingId(id);
    } catch (err) {
      console.error("Playback failed:", err);
      setPlayError("Playback failed. The file may not be accessible.");
      setPlayingId(null);
    }
  }

  return { playingId, playError, handlePlayPause };
}
