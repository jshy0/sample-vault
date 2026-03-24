import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlayerState {
  volume: number;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      volume: 0.8,
      setVolume: (volume) => set({ volume }),
    }),
    { name: "player" },
  ),
);
