import { Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Sample } from "@/types/sample";

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
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-secondary/50 transition-colors group">
      <button
        type="button"
        onClick={() => onPlayPause(sample.id, sample.file_url)}
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
    </div>
  );
}
