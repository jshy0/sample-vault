import { Play, Pause, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Sample } from "@/types/sample";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/api/client";

async function handleDownload(sampleId: string, name: string) {
  const { data } = await apiClient.post<{ url: string }>(`/samples/${sampleId}/download`);
  const res = await fetch(data.url);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

interface SampleRowProps {
  sample: Sample;
  isPlaying: boolean;
  onPlayPause: (id: string, fileUrl: string) => void;
}

export default function SampleRow({
  sample,
  isPlaying,
  onPlayPause,
}: SampleRowProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors group">
      <button
        type="button"
        onClick={() => onPlayPause(sample.id, sample.fileUrl)}
        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 translate-x-0.5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{sample.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {sample.username}
        </p>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0 w-24 text-right">
        {sample.bpm && (
          <span className="text-xs font-medium">{sample.bpm} BPM</span>
        )}
        {sample.key && (
          <span className="text-xs text-muted-foreground">
            {sample.mode ? `${sample.key} ${sample.mode}` : sample.key}
          </span>
        )}
      </div>

      <div className="hidden md:flex gap-1 shrink-0">
        {sample.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      {isLoggedIn && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            handleDownload(sample.id, sample.name)
          }
          aria-label="Download"
          className="shrink-0"
        >
          <Download className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
