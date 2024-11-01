import { Mesh, Light } from "three";
import { GLTF } from "three-stdlib";

export type GLTFResult = GLTF & {
  nodes: {
    Terrain: Mesh;
    SouthCameraTrack: Mesh;
    BlueLight: Light;
  };
};
