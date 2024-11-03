import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Trail1Export } from "./blends/trail_1.types";

import { CatmullRomCurve3, PerspectiveCamera, Vector3 } from "three";
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

  const camera = useThree((state) => state.camera as PerspectiveCamera);

  const offset = useSceneStore((state) => state.offset);
  const verticalLook = useSceneStore((state) => state.verticalLook);

  // Utility to set the camera position
  const setCameraPosition = useCallback(
    (progress: number) => {
      const position = cameraTrack.getPointAt(0.1 + progress * 0.8);

      position.add(offset);

      camera.position.copy(position);

      camera.lookAt(position.x, position.y + verticalLook, position.z - 1);

      camera.up.set(0, 1, 0);
    },
    [camera, cameraTrack, offset, verticalLook]
  );

  // effect to set the initial camera position
  useEffect(() => {
    setCameraPosition(useSceneStore.getState().progress);
  }, [setCameraPosition]);

  // effect to update on progress change
  const progress = useSceneStore((state) => state.progress);
  useEffect(() => {
    setCameraPosition(progress);
  }, [progress, setCameraPosition]);

  const previousTime = useRef(0);
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const difference = elapsedTime - previousTime.current;
    previousTime.current = elapsedTime;

    if (!useSceneStore.getState().isPlaying) return;

    const normalizedProgress = difference / useSceneStore.getState().period;

    useSceneStore.setState((state) => {
      state.progress = (state.progress + normalizedProgress) % 1;
    });
  });

  const fov = useSceneStore((state) => state.fov);
  const focusDistance = useSceneStore((state) => state.focusDistance);
  const focalLength = useSceneStore((state) => state.focalLength);
  const bokehScale = useSceneStore((state) => state.bokehScale);

  // effect to update fov
  useEffect(() => {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, fov]);

  return null;
}
