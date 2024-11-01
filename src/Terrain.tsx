import { useGLTF } from "@react-three/drei";
import { Mesh } from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Terrain: Mesh;
  };
};

export function Terrain({}) {
  const { nodes } = useGLTF("/trail_1_terrain.glb") as unknown as GLTFResult;

  const geometry = nodes.Terrain.geometry;

  return (
    <>
      <mesh castShadow receiveShadow geometry={geometry}>
        <meshStandardMaterial color={"hsla(130, 60%, 70%, 1)"} />
      </mesh>
    </>
  );
}
