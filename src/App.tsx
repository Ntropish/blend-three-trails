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
import { Camera } from "three";
import { PerspectiveCamera } from "three";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import CinematicMode from "./CinematicMode";

import { CinematicModeKeys } from "./CinematicMode";
import { useSceneStore } from "./SceneStore";

function App() {
  const [mode, setMode] = React.useState(CinematicModeKeys[0]);

  const period = useSceneStore((state) => state.period);

  return (
    <Container
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "0",
      }}
    >
      <Stack
        direction="row"
        sx={{
          flex: 1,
          minHeight: "0",
        }}
        spacing={1}
      >
        <Paper
          elevation={3}
          sx={{
            my: 1,
            flex: "1 1 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            minHeight: "0",
            minWidth: "0",
          }}
        >
          <Canvas
            shadows
            camera={{ position: [-3, 0.5, 3] }}
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <fog attach="fog" args={["hsla(205, 100%, 75%, 0.01)", -10, 280]} />
            <CinematicMode mode={mode} />
            <Sky
              distance={450000}
              sunPosition={[5, 5, 2]}
              inclination={0}
              azimuth={0.25}
              turbidity={2}
              rayleigh={0.2}
            />
            <CameraTrack />
            <ambientLight
              intensity={0.9}
              // diffuse sky blue
              color="hsla(200, 100%, 70%, 0.9)"
            />
            <directionalLight
              position={[5, 5, 2]}
              rotation={[Math.PI / 2 + Math.PI / 4, Math.PI / 4, 0]}
              color="hsla(40, 80%, 80%, 1)"
              intensity={1}
            />
            <Terrain />
          </Canvas>
        </Paper>
        <Paper
          elevation={3}
          sx={{
            my: 1,
            flex: "1 1 14rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Stack>
            <FormControl>
              <InputLabel id="mode-select-label">Cinematic Mode</InputLabel>
              <Select
                labelId="mode-select-label"
                id="mode-select"
                value={mode}
                label="Cinematic Mode"
                onChange={(e) => setMode(e.target.value)}
              >
                {CinematicModeKeys.map((key) => (
                  <MenuItem value={key}>{key}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const isPlaying = useSceneStore.getState().isPlaying;
                useSceneStore.setState({ isPlaying: !isPlaying });
              }}
            >
              {useSceneStore.getState().isPlaying ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </Button>
            <Box>
              <Typography id="period-slider" gutterBottom>
                Period
              </Typography>
              <Slider
                value={period}
                min={1}
                step={0.1}
                max={360}
                onChange={(e, value) => {
                  useSceneStore.setState({ period: value as number });
                }}
                valueLabelDisplay="auto"
                aria-labelledby="period-slider"
              />
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default App;
