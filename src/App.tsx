import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Terrain } from "./Terrain";

import { Sky } from "@react-three/drei";

import { Container, Paper, Stack } from "@mui/material";
import CameraTrack from "./CameraTrack";

import CinematicMode from "./CinematicMode";

import { SceneControls } from "./SceneControls";

function App() {
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
          my: 1,
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
            <fog attach="fog" args={["hsla(205, 100%, 70%, 0.01)", -10, 520]} />
            <CinematicMode />
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
              intensity={0.8}
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
          <SceneControls />
        </Paper>
      </Stack>
    </Container>
  );
}

export default App;
