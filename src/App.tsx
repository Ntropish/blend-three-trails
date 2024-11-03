import { CameraControls } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Terrain } from "./Terrain";

import { Sky } from "@react-three/drei";

import { Container, Box, Paper } from "@mui/material";
import CameraTrack from "./CameraTrack";

import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
function App() {
  return (
    <Container
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
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
          <fog attach="fog" args={["hsla(215, 100%, 75%, 0.01)", -10, 280]} />
          <EffectComposer>
            <DepthOfField
              focusDistance={0.015} // where to focus
              focalLength={0.02} // focal length
              bokehScale={1.5} // bokeh size
            />
          </EffectComposer>
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
            intensity={0.5}
            // diffuse sky blue
            color="hsla(200, 100%, 70%, 0.9)"
          />
          <directionalLight
            position={[5, 5, 2]}
            rotation={[Math.PI / 2 + Math.PI / 4, Math.PI / 4, 0]}
            color="hsla(40, 80%, 80%, 1)"
            intensity={2}
          />
          <Terrain />
        </Canvas>
      </Paper>
      <Paper
        elevation={3}
        sx={{
          my: 1,
          flex: "1 1 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        Hi
      </Paper>
    </Container>
  );
}

export default App;
