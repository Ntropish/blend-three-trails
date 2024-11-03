import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Trail1Export } from "./blends/trail_1.types";

import { CatmullRomCurve3, Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";

// Atmospheric Depth
// 35mm
// FOV: 60
// DoF: 0.1
// Filters: Glare
// Framed Panorama
// 50mm
// FOV: 40
// DoF: 0.3
// Filters: Glare, Vignette, chromatic aberration
// Low Angle
// 24mm
// FOV: 50
// DoF: 0.2
// Filters: Glare, Vignette, chromatic aberration

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

  const previousTime = useRef(0);
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    previousTime.current = elapsedTime;

    const normalizedPosition =
      ((elapsedTime / 3) % cameraTrack.getLength()) +
      (cameraTrack.getLength() * 2) / 3;
    const position = cameraTrack.getPoint(
      normalizedPosition / cameraTrack.getLength()
    );

    // move up and back
    position.y += 5;
    position.z += 7;

    camera.position.copy(position);

    camera.lookAt(position.x, position.y - 0.1, position.z - 1);

    camera.up.set(0, 1, 0);
  });

  return null;
}
