import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GENRE_TAGS } from "@/lib/placeholder-data";

const QUICK_TAGS = GENRE_TAGS.slice(0, 8);

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(262 83% 58% / 0.5) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Headline */}
        <h1 className="text-center text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-none mb-6">
          Find the perfect{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, hsl(262 83% 70%) 0%, hsl(300 80% 65%) 50%, hsl(200 90% 65%) 100%)",
            }}
          >
            sample.
          </span>
          <br />
          <span className="text-muted-foreground text-4xl sm:text-5xl lg:text-6xl font-semibold">
            Make something great.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-center text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover free loops, one-shots, and sample packs from thousands of
          producers. Everything you need to build your next track.
        </p>

        {/* Search bar */}
        <div className="mx-auto max-w-2xl mb-8">
          <div className="flex gap-2 p-1.5 rounded-xl border border-border/60 bg-secondary/50 backdrop-blur-sm shadow-xl shadow-black/20">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder='Try "90 bpm hip-hop loop" or "dark trap 808"'
                className="pl-12 h-12 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/60"
              />
            </div>
            <Button
              size="lg"
              className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 shrink-0"
            >
              Search
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick tag pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-border/60 bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-primary/10 transition-all duration-200 cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
