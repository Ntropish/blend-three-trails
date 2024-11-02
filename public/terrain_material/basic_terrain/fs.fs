varying vec3 csm_vPosition;
varying vec3 vVertexColor;
varying vec3 csm_vNormal;

uniform sampler2D uDirtDiffuse;
uniform sampler2D uDirtHeight;
uniform sampler2D uGrassDiffuse;
uniform sampler2D uGrassHeight;
uniform float uTextureScale;
uniform float uHeightBlendScale;
uniform float uHeightBlendBias;


void main() {
  vec2 uv = csm_vPosition.xz * uTextureScale;

  vec4 dirtDiffuse = texture2D(uDirtDiffuse, uv);
  vec4 grassDiffuse = texture2D(uGrassDiffuse, uv);

  float dirtHeight = texture2D(uDirtHeight, uv).r;
  float grassHeight = texture2D(uGrassHeight, uv).r;

  // Now use the gradient to blend between the two textures
  float blend = dot(csm_vNormal, vec3(0.0, 1.0, 0.0));

  // Create a sharp transition between the two textures
  blend = smoothstep(0.65, 0.9, blend);

  csm_DiffuseColor = mix(dirtDiffuse, grassDiffuse, blend);
}