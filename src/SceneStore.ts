import create from "zustand";

export type SceneStore = {
  progress: number;
  speedMultiplier: number;
  isPlaying: boolean;
  period: number;
};

export const useSceneStore = create<SceneStore>(() => ({
  progress: 0.5,
  speedMultiplier: 1,
  isPlaying: false,
  period: 120,
}));
