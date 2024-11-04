import React from "react";

import { CameraControls } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Terrain } from "./Terrain";

import { Sky } from "@react-three/drei";

import {
  Container,
  Box,
  Paper,
  Stack,
  Button,
  TextField,
  Slider,
  Typography,
} from "@mui/material";
import CameraTrack from "./CameraTrack";

import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { Camera, Vector3 } from "three";
import { PerspectiveCamera } from "three";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import CinematicMode from "./CinematicMode";

import { useSceneStore } from "./SceneStore";
export const SceneControls = () => {
  const isPlaying = useSceneStore((state) => state.isPlaying);
  const period = useSceneStore((state) => state.period);
  const offsetY = useSceneStore((state) => state.offset.y);
  const offsetZ = useSceneStore((state) => state.offset.z);

  const verticalLook = useSceneStore((state) => state.verticalLook);

  const fov = useSceneStore((state) => state.fov);
  const zoom = useSceneStore((state) => state.zoom);
  const focusDistance = useSceneStore((state) => state.focusDistance);
  const focalLength = useSceneStore((state) => state.focalLength);
  const bokehScale = useSceneStore((state) => state.bokehScale);

  const chromaticAberationLength = useSceneStore(
    (state) => state.chromaticAberationLength
  );

  const bloomIntensity = useSceneStore((state) => state.bloomIntensity);

  const progress = useSceneStore((state) => state.progress);

  return (
    <Stack
      spacing={2}
      sx={{
        p: 2,
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Box>
        <Typography id="progress-slider" gutterBottom>
          Progress
        </Typography>
        <Slider
          value={progress}
          min={0}
          max={1}
          step={0.00001}
          onChange={(e, value) => {
            useSceneStore.setState({ progress: value as number });
          }}
          aria-labelledby="progress-slider"
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          // const isPlaying = useSceneStore.getState().isPlaying;
          useSceneStore.setState((state) => {
            return { isPlaying: !state.isPlaying };
          });
        }}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <Box>
        <Typography id="period-slider" gutterBottom>
          Period
        </Typography>
        <Slider
          value={period}
          min={1}
          step={0.1}
          max={720}
          onChange={(e, value) => {
            useSceneStore.setState({ period: value as number });
          }}
          valueLabelDisplay="auto"
          aria-labelledby="period-slider"
        />
      </Box>

      <Box>
        <Typography id="offset-y-slider" gutterBottom>
          Offset Up
        </Typography>
        <Slider
          track={false}
          value={offsetY}
          min={-1}
          step={0.01}
          max={10}
          onChange={(e, value) => {
            useSceneStore.setState((state) => ({
              ...state,
              offset: new Vector3(
                state.offset.x,
                value as number,
                state.offset.z
              ),
            }));
          }}
          valueLabelDisplay="auto"
          aria-labelledby="offset-y-slider"
        />
      </Box>
      <Box>
        <Typography id="offset-z-slider" gutterBottom>
          Offset Back
        </Typography>
        <Slider
          track={false}
          value={offsetZ}
          min={-10}
          step={0.01}
          max={50}
          onChange={(e, value) => {
            useSceneStore.setState((state) => ({
              ...state,
              offset: new Vector3(
                state.offset.x,
                state.offset.y,
                value as number
              ),
            }));
          }}
          valueLabelDisplay="auto"
          aria-labelledby="offset-z-slider"
        />
      </Box>

      <Box>
        <Typography id="vertical-look-slider" gutterBottom>
          Vertical Look
        </Typography>
        <Slider
          track={false}
          value={verticalLook}
          min={-1}
          step={0.01}
          max={1}
          onChange={(e, value) => {
            useSceneStore.setState({ verticalLook: value as number });
          }}
          valueLabelDisplay="auto"
          aria-labelledby="vertical-look-slider"
        />
      </Box>

      <Box>
        <Typography id="fov-slider" gutterBottom>
          FOV
        </Typography>
        <Slider
          track={false}
          value={fov}
          min={1}
          step={1}
          max={180}
          onChange={(e, value) => {
            useSceneStore.setState({ fov: value as number });
          }}
          valueLabelDisplay="auto"
          aria-labelledby="fov-slider"
        />
      </Box>

      {/* Zoom */}
      <Box>
        <Typography id="zoom-slider" gutterBottom>
          Zoom
        </Typography>
        <Slider
          track={false}
          value={zoom}
          min={0.1}
          step={0.01}
          max={10}
          onChange={(e, value) => {
            useSceneStore.setState({ zoom: value as number });
          }}
          valueLabelDisplay="auto"
          aria-labelledby="zoom-slider"
        />
      </Box>

      <Box>
        <Typography id="focus-distance-slider" gutterBottom>
          Focus Distance
        </Typography>
        <Slider
          track={false}
          value={focusDistance}
          min={0}
          step={0.001}
          max={300}
          onChange={(e, value) => {
            useSceneStore.setState({ focusDistance: value as number });
          }}
          valueLabelDisplay="auto"
          aria-labelledby="focus-distance-slider"
        />
      </Box>

      <Box>
        <Typography id="focal-length-slider" gutterBottom>
          Focal Range
        </Typography>
        <Slider
          track={false}
          value={focalLength}
          min={0}
          step={0.001}
          max={300}
          onChange={(e, value) => {
            useSceneStore.setState({ focalLength: value as number });
          }}
          valueLabelDisplay="auto"
          aria-labelledby="focal-length-slider"
        />
      </Box>

      <Box>
        <Typography id="bokeh-scale-slider" gutterBottom>
          Bokeh Scale
        </Typography>
        <Slider
          track={false}
          value={bokehScale}
          min={0}
          step={0.01}
          max={10}
          onChange={(e, value) => {
            useSceneStore.setState({ bokehScale: value as number });
          }}
          valueLabelDisplay="auto"
          aria-labelledby="bokeh-scale-slider"
        />
      </Box>

      {/* Chromatic Aberration Length */}
      <Box>
        <Typography id="chromatic-aberration-length-slider" gutterBottom>
          Chromatic Aberration Length
        </Typography>
        <Slider
          track={false}
          value={chromaticAberationLength}
          min={0}
          step={0.00001}
          max={0.003}
          onChange={(e, value) => {
            useSceneStore.setState({
              chromaticAberationLength: value as number,
            });
          }}
          valueLabelDisplay="auto"
          aria-labelledby="chromatic-aberration-length-slider"
        />
      </Box>

      {/* Bloom Intensity */}
      <Box>
        <Typography id="bloom-intensity-slider" gutterBottom>
          Bloom Intensity
        </Typography>
        <Slider
          track={false}
          value={bloomIntensity}
          min={0}
          step={0.01}
          max={2}
          onChange={(e, value) => {
            useSceneStore.setState({ bloomIntensity: value as number });
          }}
          valueLabelDisplay="auto"
          aria-labelledby="bloom-intensity-slider"
        />
      </Box>
    </Stack>
  );
};
