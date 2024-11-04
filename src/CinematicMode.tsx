import React from "react";

import { CameraControls } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Terrain } from "./Terrain";

import { Sky } from "@react-three/drei";

import { Container, Box, Paper } from "@mui/material";
import CameraTrack from "./CameraTrack";

import { BlurPass, BoxBlurPass, KernelSize } from "postprocessing";

import {
  DepthOfField,
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { Camera, Vector2 } from "three";
import { PerspectiveCamera } from "three";
import { useSceneStore } from "./SceneStore";

export default function CinematicMode() {
  const focusDistance = useSceneStore((state) => state.focusDistance);
  const focalLength = useSceneStore((state) => state.focalLength);
  const bokehScale = useSceneStore((state) => state.bokehScale);

  const bloomIntensity = useSceneStore((state) => state.bloomIntensity);

  const chromaticAberationLength = useSceneStore(
    (state) => state.chromaticAberationLength
  );

  console.log(focalLength);

  return (
    <EffectComposer>
      {/* <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
      /> */}
      <DepthOfField
        // focusDistance={focusDistance}
        // focalLength={focalLength}
        bokehScale={bokehScale}
        worldFocusDistance={focusDistance}
        worldFocusRange={focalLength}
      />

      <ChromaticAberration
        offset={[chromaticAberationLength, chromaticAberationLength]}
      />
    </EffectComposer>
  );
}
