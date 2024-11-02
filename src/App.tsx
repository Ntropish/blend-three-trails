import { CameraControls } from "@react-three/drei";
import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Terrain } from "./Terrain";

import { Container, Box, Paper } from "@mui/material";
import CameraTrack from "./CameraTrack";
function App() {
  return (
    <Container
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
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
          <CameraTrack />
          <ambientLight
            intensity={1.0}
            // diffuse sky blue
            color="hsla(200, 100%, 70%, 0.9)"
          />
          <directionalLight
            position={[-5, 5, -5]}
            rotation={[Math.PI / 2 + Math.PI / 4, Math.PI / 4, 0]}
            color="hsla(40, 70%, 50%, 1)"
            intensity={20}
          />
          <Terrain />
          <CameraControls makeDefault />
        </Canvas>
      </Paper>
    </Container>
  );
}

export default App;
