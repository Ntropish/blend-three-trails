import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Trail1Export } from "./blends/trail_1.types";

import { CatmullRomCurve3, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";

export default function CameraTrack() {
  const { nodes } = useGLTF("/trail_1.export.glb") as unknown as Trail1Export;

  const cameraTrack = useMemo(() => {
    const geometry = nodes.SouthCameraTrack.geometry;
    const points = geometry.attributes.position.array;
    const pointsArray = [];

    for (let i = 0; i < points.length; i += 3) {
      pointsArray.push(new Vector3(points[i], points[i + 1], points[i + 2]));
    }
    // export type CurveType = "centripetal" | "chordal" | "catmullrom";
    return new CatmullRomCurve3(pointsArray, false, "centripetal", 0.0001);
  }, [nodes]);

  const camera = useThree((state) => state.camera);

  const previousTime = useRef(0);
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    previousTime.current = elapsedTime;

    // Travel through the curve at 1 unit per second
    const normalizedPosition =
      ((elapsedTime / 8) % cameraTrack.getLength()) +
      (cameraTrack.getLength() * 2) / 3;
    const position = cameraTrack.getPoint(
      normalizedPosition / cameraTrack.getLength()
    );

    camera.position.copy(position);

    camera.lookAt(position.x, position.y, position.z - 1);

    camera.up.set(0, 1, 0);
  });

  return null;
}
