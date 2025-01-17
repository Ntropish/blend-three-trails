import { Mesh, Light } from "three";
import { GLTF } from "three-stdlib";

export type Trail1Export = GLTF & {
  nodes: {
    Terrain: Mesh;
    Track: Mesh;
    BlueLight: Light;
    Tree: Mesh;
    Sky: Mesh;
    mountain_1: Mesh;
    mountain_2: Mesh;
    mountain_3: Mesh;
  };
};
