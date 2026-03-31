import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSamples } from "@/hooks/useSamples";
import { useSamplePlayer } from "@/hooks/useSamplePlayer";
import SampleRow from "@/components/SampleRow";

export default function LatestSamples() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useSamples();
  const samples = data?.pages.flat() ?? [];
  const { playingId, playError, handlePlayPause } = useSamplePlayer();

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
              onPlayPause={handlePlayPause}
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
