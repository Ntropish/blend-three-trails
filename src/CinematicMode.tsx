import React from "react";

import { CameraControls } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Terrain } from "./Terrain";

import { Sky } from "@react-three/drei";

import { Container, Box, Paper } from "@mui/material";
import CameraTrack from "./CameraTrack";

import {
  DepthOfField,
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { Camera } from "three";
import { PerspectiveCamera } from "three";
import { KernelSize } from "postprocessing";

type CinematicStyle = {
  fov: number;
  focusDistance: number;
  focalLength: number;
  bokehScale: number;
  glare: boolean | number;
  vignette: boolean | number;
  chromaticAberration: boolean | number;
  cameraOffset: {
    x: number;
    y: number;
    z: number;
  };
  cameraVerticalLook: number;
};

const cinematicModes: Record<string, CinematicStyle> = {
  "Atmospheric Depth": {
    fov: 60,
    focusDistance: 0.015,
    focalLength: 1,
    bokehScale: 0.1,
    glare: 0.1,
    vignette: false,
    chromaticAberration: false,
    cameraOffset: {
      x: 0,
      y: 3,
      z: 3,
    },
    cameraVerticalLook: 0,
  },
  "Framed Panorama": {
    fov: 40,
    focusDistance: 0.015,
    focalLength: 0.02,
    bokehScale: 2,
    glare: 0.2,
    vignette: 0.1,
    chromaticAberration: 0.1,
    cameraHeight: {
      x: 0,
      y: 3,
      z: 3,
    },
    cameraVerticalLook: -0.2,
  },
  "Low Angle": {
    fov: 50,
    focusDistance: 0.015,
    focalLength: 1,
    bokehScale: 1,
    glare: 0.1,
    vignette: 0.1,
    chromaticAberration: 0.1,
    cameraOffset: {
      x: 0,
      y: 3,
      z: 3,
    },
    cameraVerticalLook: 0,
  },
};

export const CinematicModeKeys = Object.keys(cinematicModes);

export default function CinematicMode({ mode }: { mode: string }) {
  const {
    fov,
    focusDistance,
    focalLength,
    bokehScale,
    glare,
    vignette,
    chromaticAberration,
  } = cinematicModes[mode];

  const camera = useThree((state) => state.camera) as PerspectiveCamera;

  React.useEffect(() => {
    camera.fov = fov;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
  }, [camera, fov]);

  return (
    <EffectComposer>
      <DepthOfField
        // focusDistance={0.015} // where to focus
        // focalLength={0.02} // focal length
        // bokehScale={1} // bokeh size
        focusDistance={focusDistance}
        focalLength={focalLength}
        bokehScale={bokehScale}
      />
      {typeof glare === "number" ? (
        <Bloom
          // intensity={1.0} // The bloom intensity.
          // blurPass={undefined} // A blur pass.
          // kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
          // luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
          // mipmapBlur={false} // Enables or disables mipmap blur.
          // resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
          // resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
          intensity={glare}
        />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}
