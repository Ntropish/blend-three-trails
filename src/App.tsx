import { CameraControls } from "@react-three/drei";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Terrain } from "./Terrain";

import { Container, Box } from "@mui/material";
function App() {
  return (
    <Container
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
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
          <ambientLight
            intensity={0.8}
            // diffuse sky blue
            color="hsla(200, 100%, 50%, 0.9)"
          />
          <directionalLight
            position={[-5, 5, -5]}
            rotation={[Math.PI / 2 + Math.PI / 4, Math.PI / 4, 0]}
            color="hsla(40, 70%, 50%, 1)"
            intensity={10}
          />
          <Terrain />
          <CameraControls makeDefault />
        </Canvas>
      </Box>
    </Container>
  );
}

export default App;
