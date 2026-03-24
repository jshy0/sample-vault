import { useState } from "react";
import { Play, Pause, Music } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Sample } from "@/types/sample";
import { useSamples } from "@/hooks/useSamples";

function SampleRow({
  sample,
  isPlaying,
  onPlayPause,
}: {
  sample: Sample;
  isPlaying: boolean;
  onPlayPause: () => void;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors group">
      {/* Play button */}
      <button
        type="button"
        onClick={onPlayPause}
        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 translate-x-0.5" />
        )}
      </button>

      {/* Waveform placeholder */}
      <div className="shrink-0 w-24 h-8 flex items-end gap-px opacity-40 group-hover:opacity-70 transition-opacity">
        {Array.from({ length: 24 }, (_, i) => (
          <div
            key={i}
            className="flex-1 bg-primary rounded-sm"
            style={{ height: `${20 + Math.sin(i * 1.3) * 14}px` }}
          />
        ))}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{sample.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {sample.user_id}
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSamples();
  const samples = data?.pages.flat() ?? [];

  function handlePlayPause(id: string) {
    setPlayingId((prev) => (prev === id ? null : id));
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
              onPlayPause={() => handlePlayPause(sample.id)}
            />
          ))
        )}
      </div>

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
