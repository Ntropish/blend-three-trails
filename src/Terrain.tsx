import { useGLTF } from "@react-three/drei";
import { Trail1Export } from "./blends/trail_1.types";
import { useMemo } from "react";
import {
  TextureLoader,
  Vector2,
  Vector3,
  DoubleSide,
  ShaderMaterial,
} from "three";
import { useLoader, useThree } from "@react-three/fiber";
import { BasicTerrainMaterial } from "./BasicTerrainMaterial";

export function Terrain() {
  const { nodes } = useGLTF("/trail_1.export.glb") as unknown as Trail1Export;

  console.log(nodes);

  const geometry = nodes.Terrain.geometry;

  return (
    <>
      <mesh castShadow receiveShadow geometry={geometry}>
        <BasicTerrainMaterial />
      </mesh>
    </>
  );
}
