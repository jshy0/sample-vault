import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCreateSample } from "@/hooks/useSamples";
import { MUSICAL_KEYS, MUSICAL_MODES } from "@/lib/constants";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  bpm: z
    .number({ error: "BPM must be a number" })
    .int()
    .min(20, "Min BPM is 20")
    .max(300, "Max BPM is 300")
    .optional()
    .or(z.literal("")),
  key: z.string().optional(),
  mode: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function UploadPage() {
  const navigate = useNavigate();
  const { mutateAsync: createSample, isPending } = useCreateSample();

  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { key: "", mode: "" },
  });

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) pickFile(dropped);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (picked) pickFile(picked);
  }

  function pickFile(f: File) {
    if (!f.type.startsWith("audio/")) {
      setFileError("Only audio files are accepted.");
      return;
    }
    setFileError("");
    setFile(f);
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim();
      if (val && !tags.includes(val) && tags.length < 8) {
        setTags((prev) => [...prev, val]);
      }
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function onSubmit(data: FormValues) {
    if (!file) {
      setFileError("Please select an audio file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", data.name);
    if (data.bpm) formData.append("bpm", String(data.bpm));
    if (data.key) formData.append("key", data.key);
    if (data.mode) formData.append("mode", data.mode);
    formData.append("tags", JSON.stringify(tags));
    await createSample(formData);
    navigate("/");
  }

  return (
    <main className="flex flex-1 justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Upload a Sample
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Share your sounds with the community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-6"
        >
          {/* File drop zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors bg-secondary/30 hover:bg-secondary/50 px-6 py-10 flex flex-col items-center gap-3 text-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileInput}
            />
            {file ? (
              <>
                <Music className="h-8 w-8 text-primary" />
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Drop your audio file here
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    or click to browse — Only WAV accepted
                  </p>
                </div>
              </>
            )}
          </div>
          {fileError && (
            <p className="text-xs text-destructive -mt-4">{fileError}</p>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Sample name</label>
            <Input placeholder="e.g. Dusty Kick 808" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* BPM + Key + Mode */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                BPM{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <Input
                type="number"
                placeholder="e.g. 140"
                {...register("bpm", { valueAsNumber: true })}
              />
              {errors.bpm && (
                <p className="text-xs text-destructive">{errors.bpm.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Key{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <select
                {...register("key")}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">—</option>
                {MUSICAL_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Mode{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <select
                {...register("mode")}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">—</option>
                {MUSICAL_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Tags{" "}
              <span className="text-muted-foreground font-normal">
                (optional, max 8)
              </span>
            </label>
            <div className="flex flex-wrap gap-1.5 rounded-md border border-input bg-transparent px-3 py-2 min-h-9 focus-within:ring-1 focus-within:ring-primary">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {tags.length < 8 && (
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  placeholder={
                    tags.length === 0 ? "Type a tag and press Enter" : ""
                  }
                  className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isPending}
            >
              {isPending ? "Uploading…" : "Upload Sample"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
