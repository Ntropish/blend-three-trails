// src/TerrainMaterial.ts
import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader, FileLoader } from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import * as THREE from "three";

export const BasicTerrainMaterial = () => {
  // Load textures
  const [dirtDiffuse, dirtHeight, grassDiffuse, grassHeight] = useLoader(
    TextureLoader,
    [
      "/terrain_material/dirt/material_diffuseOriginal.bmp",
      "/terrain_material/dirt/material_height.bmp",
      "/terrain_material/grass/material_diffuseOriginal.bmp",
      "/terrain_material/grass/material_height.bmp",
    ]
  );

  const [fs, vs] = useLoader(FileLoader, [
    "/terrain_material/basic_terrain/fs.fs",
    "/terrain_material/basic_terrain/vs.vs",
  ]);

  // Set texture parameters
  [dirtDiffuse, dirtHeight, grassDiffuse, grassHeight].forEach((texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 16;
  });

  const uniforms = useMemo(() => {
    return {
      uDirtDiffuse: { value: dirtDiffuse },
      uDirtHeight: { value: dirtHeight },
      uGrassDiffuse: { value: grassDiffuse },
      uGrassHeight: { value: grassHeight },
      uTextureScale: { value: 2.0 },
      uHeightBlendScale: { value: 2.0 },
      uHeightBlendBias: { value: -1.0 },
    };
  }, [dirtDiffuse, dirtHeight, grassDiffuse, grassHeight]);

  console.log(fs, vs);

  return (
    <CustomShaderMaterial
      uniforms={uniforms}
      vertexShader={vs?.toString()}
      fragmentShader={fs?.toString()}
      baseMaterial={THREE.MeshStandardMaterial}
    />
  );
};
