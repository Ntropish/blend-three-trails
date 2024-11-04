import { Vector3 } from "three";
import create from "zustand";

export type SceneStore = {
  progress: number;
  speedMultiplier: number;
  isPlaying: boolean;
  period: number;
  offset: Vector3;
  verticalLook: number;
  fov: number;
  zoom: number;
  focusDistance: number;
  focalLength: number;
  bokehScale: number;

  bloomIntensity: number;
  chromaticAberationLength: number;
};

export const useSceneStore = create<SceneStore>(() => ({
  progress: 0.5,
  speedMultiplier: 1,
  isPlaying: false,
  period: 270,
  offset: new Vector3(0, 3, 7),
  verticalLook: -0.2,
  fov: 50,
  zoom: 1,
  focusDistance: 0.015,
  focalLength: 0.02,
  bokehScale: 1,
  bloomIntensity: 1,
  chromaticAberationLength: 0.001,
}));
