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

import { CinematicModeKeys } from "./CinematicMode";
import { useSceneStore } from "./SceneStore";

function App() {
  const [mode, setMode] = React.useState(CinematicModeKeys[0]);

  const period = useSceneStore((state) => state.period);
  const offsetX = useSceneStore((state) => state.offset.x);
  const offsetY = useSceneStore((state) => state.offset.y);
  const offsetZ = useSceneStore((state) => state.offset.z);

  const verticalLook = useSceneStore((state) => state.verticalLook);

  const fov = useSceneStore((state) => state.fov);
  const focusDistance = useSceneStore((state) => state.focusDistance);
  const focalLength = useSceneStore((state) => state.focalLength);
  const bokehScale = useSceneStore((state) => state.bokehScale);

  const progress = useSceneStore((state) => state.progress);

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
          <Stack
            spacing={2}
            sx={{
              p: 2,
              width: "100%",
              height: "100%",
              overflow: "auto",
            }}
          >
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

            <Box>
              <Typography id="progress-slider" gutterBottom>
                Progress
              </Typography>
              <Slider
                track={false}
                value={progress}
                min={0}
                step={0.01}
                max={1}
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

            <Box>
              <Typography id="focus-distance-slider" gutterBottom>
                Focus Distance
              </Typography>
              <Slider
                track={false}
                value={focusDistance}
                min={0}
                step={0.001}
                max={1}
                onChange={(e, value) => {
                  useSceneStore.setState({ focusDistance: value as number });
                }}
                valueLabelDisplay="auto"
                aria-labelledby="focus-distance-slider"
              />
            </Box>

            <Box>
              <Typography id="focal-length-slider" gutterBottom>
                Focal Length
              </Typography>
              <Slider
                track={false}
                value={focalLength}
                min={0}
                step={0.001}
                max={1}
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
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

export default App;
