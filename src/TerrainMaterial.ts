import { useGLTF } from "@react-three/drei";
import { Trail1Export } from "./blends/trail_1.types";
import { useMemo } from "react";
import {
  TextureLoader,
  Vector2,
  Vector3,
  DoubleSide,
  ShaderMaterial,
} from "three";
import { useLoader, useThree } from "@react-three/fiber";
export const useTerrainMaterial = () => {
  const dirtDiffuse = useLoader(
    TextureLoader,
    "/terrain_material/dirt/material_diffuseOriginal.bmp"
  );
  const dirtNormal = useLoader(
    TextureLoader,
    "/terrain_material/dirt/material_normal.bmp"
  );
  const dirtHeight = useLoader(
    TextureLoader,
    "/terrain_material/dirt/material_height.bmp"
  );
  const dirtSmoothness = useLoader(
    TextureLoader,
    "/terrain_material/dirt/material_smoothness.bmp"
  );

  const rockDiffuse = useLoader(
    TextureLoader,
    "/terrain_material/rock/material_diffuseOriginal.bmp"
  );
  const rockNormal = useLoader(
    TextureLoader,
    "/terrain_material/rock/material_normal.bmp"
  );
  const rockHeight = useLoader(
    TextureLoader,
    "/terrain_material/rock/material_height.bmp"
  );
  const rockSmoothness = useLoader(
    TextureLoader,
    "/terrain_material/rock/material_smoothness.bmp"
  );

  const grassDiffuse = useLoader(
    TextureLoader,
    "/terrain_material/grass/material_diffuseOriginal.bmp"
  );
  const grassNormal = useLoader(
    TextureLoader,
    "/terrain_material/grass/material_normal.bmp"
  );
  const grassHeight = useLoader(
    TextureLoader,
    "/terrain_material/grass/material_height.bmp"
  );
  const grassSmoothness = useLoader(
    TextureLoader,
    "/terrain_material/grass/material_smoothness.bmp"
  );

  const terrainMaterial = useMemo(() => {
    const uniforms = {
      // Dirt Textures
      dirtDiffuse: { value: dirtDiffuse },
      dirtNormal: { value: dirtNormal },
      dirtHeight: { value: dirtHeight },
      dirtSmoothness: { value: dirtSmoothness },

      // Rock Textures
      rockDiffuse: { value: rockDiffuse },
      rockNormal: { value: rockNormal },
      rockHeight: { value: rockHeight },
      rockSmoothness: { value: rockSmoothness },

      // Grass Textures
      grassDiffuse: { value: grassDiffuse },
      grassNormal: { value: grassNormal },
      grassHeight: { value: grassHeight },
      grassSmoothness: { value: grassSmoothness },

      // Other uniforms
      lightDirection: { value: new Vector3(0.5, 1.0, 0.5).normalize() },
      repeat: { value: new Vector2(50, 50) }, // Adjust as needed
      heightScale: { value: 0.1 }, // Scale for parallax effect
    };

    const terrainMaterial = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: /* glsl */ `
        attribute float dirtWeight;
        attribute float rockWeight;
        attribute float grassWeight;

        varying float vDirtWeight;
        varying float vRockWeight;
        varying float vGrassWeight;

        varying vec2 vUv;
        varying vec3 vViewPosition;
        varying vec3 vNormal;

        uniform vec2 repeat;

        void main() {
          vUv = uv * repeat;
          vColor = color; // Use the color attribute as blending weights
          
          vDirtWeight = color;
          vRockWeight = rockWeight;
          vGrassWeight = grassWeight;

          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = viewPosition.xyz;
          vNormal = normalize(normalMatrix * normal);

          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        // Fragment Shader
        varying float vDirtWeight;
        varying float vRockWeight;
        varying float vGrassWeight;

        varying vec2 vUv;
        varying vec3 vViewPosition;
        varying vec3 vNormal;


        uniform sampler2D dirtDiffuse;
        uniform sampler2D dirtNormal;
        uniform sampler2D dirtHeight;
        uniform sampler2D dirtRoughness;

        uniform sampler2D rockDiffuse;
        uniform sampler2D rockNormal;
        uniform sampler2D rockHeight;
        uniform sampler2D rockRoughness;

        uniform sampler2D grassDiffuse;
        uniform sampler2D grassNormal;
        uniform sampler2D grassHeight;
        uniform sampler2D grassRoughness;


        // Uniforms for light
        uniform vec3 lightDirection;
        uniform float heightScale;

        vec3 getViewDir() {
          return normalize(-vViewPosition);
        }

        // Parallax mapping function (same as before)
        vec2 parallaxMapping(sampler2D heightMap, vec2 uv, vec3 viewDir) {
          // Implement parallax mapping (stepped or relief mapping)
          // For simplicity, we'll use basic parallax mapping
          float height = texture2D(heightMap, uv).r;
          vec2 p = viewDir.xy * (height * heightScale);
          return uv - p;
        }


        void main() {
          vec3 viewDir = getViewDir();
        
          // Parallax Mapping
          vec2 dirtUv = parallaxMapping(dirtHeight, vUv, viewDir);
          vec2 rockUv = parallaxMapping(rockHeight, vUv, viewDir);
          vec2 grassUv = parallaxMapping(grassHeight, vUv, viewDir);
        
          // Ensure UVs are within 0 to 1 range
          dirtUv = fract(dirtUv);
          rockUv = fract(rockUv);
          grassUv = fract(grassUv);
        
          // Sample heightmaps
          float dirtLayerHeight = texture2D(dirtHeight, dirtUv).r;
          float rockLayerHeight = texture2D(rockHeight, rockUv).r;
          float grassLayerHeight = texture2D(grassHeight, grassUv).r;
        
          // Base weights from geometry attributes
          float dirtWeight = vDirtWeight;
          float rockWeight = vRockWeight;
          float grassWeight = vGrassWeight;
        
          // Refine weights using heightmaps
          dirtWeight *= dirtLayerHeight;
          rockWeight *= rockLayerHeight;
          grassWeight *= grassLayerHeight;
        
          // Normalize weights
          float totalWeight = dirtWeight + rockWeight + grassWeight + 1e-6; // Add small value to prevent division by zero
          dirtWeight /= totalWeight;
          rockWeight /= totalWeight;
          grassWeight /= totalWeight;
        
          // Sample textures
          vec4 dirtColor = texture2D(dirtDiffuse, dirtUv);
          vec4 rockColor = texture2D(rockDiffuse, rockUv);
          vec4 grassColor = texture2D(grassDiffuse, grassUv);
        
          // Sample normal maps and convert to world space normals
          vec3 dirtNormalMap = texture2D(dirtNormal, dirtUv).rgb * 2.0 - 1.0;
          vec3 rockNormalMap = texture2D(rockNormal, rockUv).rgb * 2.0 - 1.0;
          vec3 grassNormalMap = texture2D(grassNormal, grassUv).rgb * 2.0 - 1.0;
        
          // Blend normals
          vec3 blendedNormal = normalize(
            dirtNormalMap * dirtWeight +
            rockNormalMap * rockWeight +
            grassNormalMap * grassWeight
          );
        
          // Lighting
          vec3 lightDir = normalize(lightDirection);
          float diff = max(dot(blendedNormal, lightDir), 0.0);
        
          // Blend colors
          vec3 blendedColor = dirtColor.rgb * dirtWeight +
                              rockColor.rgb * rockWeight +
                              grassColor.rgb * grassWeight;
        
          // Apply lighting
          vec3 finalColor = blendedColor * diff;
        
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: DoubleSide,
    });

    return terrainMaterial;
  }, [
    dirtDiffuse,
    dirtNormal,
    dirtHeight,
    dirtSmoothness,
    rockDiffuse,
    rockNormal,
    rockHeight,
    rockSmoothness,
    grassDiffuse,
    grassNormal,
    grassHeight,
    grassSmoothness,
  ]);

  return terrainMaterial;
};
