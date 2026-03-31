import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchResults } from "@/hooks/useSearchResults";
import { useSamplePlayer } from "@/hooks/useSamplePlayer";
import SampleRow from "@/components/SampleRow";
import FilterSidebar from "@/components/FilterSidebar";

const DEFAULT_BPM_MIN = 20;
const DEFAULT_BPM_MAX = 300;

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? undefined;
  const keyParam = searchParams.get("key") ?? "";
  const modeParam = searchParams.get("mode") ?? "";
  const bpmMinParam = searchParams.get("bpm_min");
  const bpmMaxParam = searchParams.get("bpm_max");

  // Local BPM state so the slider feels instant — debounced before updating the URL
  const [localBpmMin, setLocalBpmMin] = useState(
    bpmMinParam ? Number(bpmMinParam) : DEFAULT_BPM_MIN,
  );
  const [localBpmMax, setLocalBpmMax] = useState(
    bpmMaxParam ? Number(bpmMaxParam) : DEFAULT_BPM_MAX,
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (localBpmMin === DEFAULT_BPM_MIN) {
            next.delete("bpm_min");
          } else {
            next.set("bpm_min", String(localBpmMin));
          }
          if (localBpmMax === DEFAULT_BPM_MAX) {
            next.delete("bpm_max");
          } else {
            next.set("bpm_max", String(localBpmMax));
          }
          return next;
        },
        { replace: true },
      );
    }, 400);
    return () => clearTimeout(timeout);
  }, [localBpmMin, localBpmMax, setSearchParams]);

  function handleKeyChange(key: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        key ? next.set("key", key) : next.delete("key");
        return next;
      },
      { replace: true },
    );
  }

  function handleModeChange(mode: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        mode ? next.set("mode", mode) : next.delete("mode");
        return next;
      },
      { replace: true },
    );
  }

  const {
    data: samples = [],
    isLoading,
    isError,
  } = useSearchResults({
    q,
    bpm_min: bpmMinParam ? Number(bpmMinParam) : undefined,
    bpm_max: bpmMaxParam ? Number(bpmMaxParam) : undefined,
    key: keyParam || undefined,
    mode: modeParam || undefined,
  });

  const { playingId, playError, handlePlayPause } = useSamplePlayer();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        {q ? (
          <>
            Results for <span className="text-primary">"{q}"</span>
          </>
        ) : (
          "Browse Samples"
        )}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar
          bpmMin={localBpmMin}
          bpmMax={localBpmMax}
          selectedKey={keyParam}
          selectedMode={modeParam}
          onBpmChange={(min, max) => {
            setLocalBpmMin(min);
            setLocalBpmMax(max);
          }}
          onKeyChange={handleKeyChange}
          onModeChange={handleModeChange}
        />

        <div className="flex-1">
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-12 text-center">
              Loading…
            </p>
          ) : isError ? (
            <p className="text-sm text-destructive py-12 text-center">
              Something went wrong. Please try again.
            </p>
          ) : samples.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">
              No samples found.
            </p>
          ) : (
            <div className="rounded-xl border bg-card divide-y divide-border">
              {samples.map((sample) => (
                <SampleRow
                  key={sample.id}
                  sample={sample}
                  isPlaying={playingId === sample.id}
                  onPlayPause={handlePlayPause}
                />
              ))}
            </div>
          )}

          {playError && (
            <p className="mt-3 text-xs text-destructive text-center">
              {playError}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
