import { useGLTF } from "@react-three/drei";
import { Trail1Export } from "./blends/trail_1.types";

import { BasicTerrainMaterial } from "./BasicTerrainMaterial";

export function Terrain() {
  const { nodes } = useGLTF("/trail_1.export.glb") as unknown as Trail1Export;

  console.log(nodes);

  const terrainGeometry = nodes.Terrain.geometry;

  return (
    <>
      <primitive object={nodes.mountain_1} />
      <primitive object={nodes.mountain_2} />
      <primitive object={nodes.mountain_3} />
      <mesh castShadow receiveShadow geometry={terrainGeometry}>
        <BasicTerrainMaterial />
      </mesh>
    </>
  );
}
