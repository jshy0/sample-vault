import { useState } from "react";
import { Search, Menu, X, Vault, Upload, Volume2, VolumeX } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMe } from "@/hooks/useAuth";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSearch(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/samples?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setSearchOpen(false);
  }

  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const clearToken = useAuthStore((s) => s.clearToken);
  const { data: me } = useMe();
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/30 group-hover:bg-primary/30 transition-colors">
              <Vault className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Sample<span className="text-primary">Vault</span>
            </span>
          </a>

          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-sm items-center relative"
          >
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search samples..."
              className="pl-9 bg-secondary border-border/50 focus:border-primary/50 focus:ring-primary/20 h-9"
            />
          </form>

          {/* Volume slider */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={volume === 0 ? "Unmute" : "Mute"}
            >
              {volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 accent-primary cursor-pointer"
              aria-label="Volume"
            />
          </div>

          {/* Credits */}
          {isLoggedIn && me && (
            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <span className="text-primary font-semibold">{me.credits}</span>
              <span>credits</span>
            </div>
          )}

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                  onClick={() => navigate("/upload")}
                >
                  <Upload className="h-4 w-4 mr-1.5" />
                  Upload
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold border border-primary/30">
                          U
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => clearToken()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => navigate("/sign-in")}
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                  onClick={() => navigate("/sign-in")}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search samples..."
                  className="pl-9 bg-secondary border-border/50"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 px-4 py-4 space-y-1">
          <div className="pt-3 flex flex-col gap-2">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-3 px-1 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold border border-primary/30">
                      U
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    navigate("/upload");
                    setMenuOpen(false);
                  }}
                >
                  <Upload className="h-4 w-4 mr-1.5" />
                  Upload Sample
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => clearToken()}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/sign-in")}
                >
                  Log in
                </Button>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/sign-in")}
                >
                  Sign up
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
