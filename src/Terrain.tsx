import { useGLTF } from "@react-three/drei";
import { Trail1Export } from "./blends/trail_1.types";

import { BasicTerrainMaterial } from "./BasicTerrainMaterial";
import { useMemo } from "react";
import { Material, MeshBasicMaterial } from "three";
import { useFrame } from "@react-three/fiber";

export function Terrain() {
  const { nodes } = useGLTF("/trail_1.export.glb") as unknown as Trail1Export;

  console.log(nodes);

  const skyMaterial = useMemo(() => {
    const material = nodes.Sky.material;

    material.fog = false;

    return material;
  }, [nodes.Sky.material]);

  // Rotate the sky each frame
  useFrame(({ clock }) => {
    nodes.Sky.rotation.y = clock.getElapsedTime() / 1000;
  });

  return (
    <>
      <primitive object={nodes.mountain_1} />
      <primitive object={nodes.mountain_2} />
      <primitive object={nodes.mountain_3} />
      {/* <primitive object={nodes.Sky} /> */}
      {/* disable fog on Sky material */}
      <primitive object={nodes.Sky} material={skyMaterial} />
      <primitive object={nodes.Terrain} />
    </>
  );
}
