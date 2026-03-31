import { MUSICAL_KEYS, MUSICAL_MODES } from "@/lib/constants";

interface FilterSidebarProps {
  bpmMin: number;
  bpmMax: number;
  selectedKey: string;
  selectedMode: string;
  onBpmChange: (min: number, max: number) => void;
  onKeyChange: (key: string) => void;
  onModeChange: (mode: string) => void;
}

export default function FilterSidebar({
  bpmMin,
  bpmMax,
  selectedKey,
  selectedMode,
  onBpmChange,
  onKeyChange,
  onModeChange,
}: FilterSidebarProps) {
  return (
    <aside className="w-full md:w-56 shrink-0 space-y-6">
      {/* BPM filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3">BPM</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{bpmMin}</span>
            <span>{bpmMax}</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min={20}
              max={300}
              value={bpmMin}
              onChange={(e) => {
                const val = Number(e.target.value);
                onBpmChange(Math.min(val, bpmMax - 1), bpmMax);
              }}
              className="w-full accent-primary cursor-pointer"
              aria-label="Minimum BPM"
            />
            <input
              type="range"
              min={20}
              max={300}
              value={bpmMax}
              onChange={(e) => {
                const val = Number(e.target.value);
                onBpmChange(bpmMin, Math.max(val, bpmMin + 1));
              }}
              className="w-full accent-primary cursor-pointer"
              aria-label="Maximum BPM"
            />
          </div>
        </div>
      </div>

      {/* Key filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Key</h3>
        <select
          value={selectedKey}
          onChange={(e) => onKeyChange(e.target.value)}
          className="w-full rounded-md border border-border/60 bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Any</option>
          {MUSICAL_KEYS.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      {/* Mode filter */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Mode</h3>
        <select
          value={selectedMode}
          onChange={(e) => onModeChange(e.target.value)}
          className="w-full rounded-md border border-border/60 bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="">Any</option>
          {MUSICAL_MODES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
