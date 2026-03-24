import { useEffect, useRef, useState } from "react";
import { Play, Pause, Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Sample } from "@/types/sample";
import { useSamples } from "@/hooks/useSamples";
import { usePlayerStore } from "@/store/playerStore";

function SampleRow({
  sample,
  isPlaying,
  onPlayPause,
}: {
  sample: Sample;
  isPlaying: boolean;
  onPlayPause: (fileUrl: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors group">
      {/* Play button */}
      <button
        type="button"
        onClick={() => onPlayPause(sample.file_url)}
        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 translate-x-0.5" />
        )}
      </button>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{sample.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {sample.username}
        </p>
      </div>

      {/* BPM + Key */}
      <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0 w-16 text-right">
        <span className="text-xs font-medium">{sample.bpm} BPM</span>
        <span className="text-xs text-muted-foreground">{sample.key}</span>
      </div>

      {/* Tags */}
      <div className="hidden md:flex gap-1 shrink-0">
        {sample.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export default function LatestSamples() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playError, setPlayError] = useState<string | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSamples();
  const samples = data?.pages.flat() ?? [];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volume = usePlayerStore((s) => s.volume);

  // Keep audio volume in sync with the navbar slider
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

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-6">
        <Music className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Latest Samples</h2>
      </div>

      <div className="rounded-xl border bg-card divide-y divide-border">
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            Loading…
          </p>
        ) : samples.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">
            No samples yet.
          </p>
        ) : (
          samples.map((sample) => (
            <SampleRow
              key={sample.id}
              sample={sample}
              isPlaying={playingId === sample.id}
              onPlayPause={(fileUrl) => handlePlayPause(sample.id, fileUrl)}
            />
          ))
        )}
      </div>
      {playError && (
        <p className="mt-3 text-xs text-destructive text-center">{playError}</p>
      )}

      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          className="px-8"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </Button>
      </div>
    </section>
  );
}
