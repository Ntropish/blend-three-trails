import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Trail1Export } from "./blends/trail_1.types";

import { CatmullRomCurve3, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useSceneStore } from "./SceneStore";

export default function CameraTrack() {
  const { nodes } = useGLTF("/trail_1.export.glb") as unknown as Trail1Export;

  const cameraTrack = useMemo(() => {
    const geometry = nodes.Track.geometry;

    const points = geometry.attributes.position.array;
    const pointsArray = [];

    for (let i = 0; i < points.length; i += 3) {
      pointsArray.push(new Vector3(points[i], points[i + 1], points[i + 2]));
    }
    // export type CurveType = "centripetal" | "chordal" | "catmullrom";
    return new CatmullRomCurve3(pointsArray, false, "chordal", 0.0001);
  }, [nodes]);

  const camera = useThree((state) => state.camera);

  // Utility to set the camera position
  const setCameraPosition = useCallback(
    (progress: number) => {
      const position = cameraTrack.getPointAt(progress);

      // move up and back
      position.y += 4;
      position.z += 7;

      camera.position.copy(position);

      camera.lookAt(position.x, position.y - 0.1, position.z - 1);

      camera.up.set(0, 1, 0);
    },
    [camera, cameraTrack]
  );

  // effect to set the initial camera position
  useEffect(() => {
    setCameraPosition(useSceneStore.getState().progress);
  }, [setCameraPosition]);

  const previousTime = useRef(0);
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const difference = elapsedTime - previousTime.current;
    previousTime.current = elapsedTime;

    if (!useSceneStore.getState().isPlaying) return;

    const normalizedProgress = difference / useSceneStore.getState().period;

    useSceneStore.setState((state) => {
      // modulate the progress to loop
      state.progress = (state.progress + normalizedProgress) % 1;
    });

    const progress = useSceneStore.getState().progress;

    const position = cameraTrack.getPointAt(progress);

    // move up and back
    position.y += 4;
    position.z += 7;

    camera.position.copy(position);

    camera.lookAt(position.x, position.y - 0.1, position.z - 1);

    camera.up.set(0, 1, 0);
  });

  return null;
}
