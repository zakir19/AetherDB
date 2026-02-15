// Cosmic Nebula Vertex Shader
export const cosmicVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMouse;
  uniform float uScroll;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vDisplacement;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vUv = uv;
    
    float noise = snoise(vec3(position.x * 0.3, position.y * 0.3, uTime * 0.15));
    float noise2 = snoise(vec3(position.x * 0.6, position.y * 0.6, uTime * 0.1 + 10.0));
    
    vDisplacement = noise * 0.8 + noise2 * 0.4;
    
    vec3 newPosition = position;
    newPosition.z += vDisplacement * (1.0 + uMouse * 0.3);
    newPosition.y += sin(uTime * 0.2 + position.x) * 0.3 * (1.0 - uScroll);
    
    vPosition = newPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

// Cosmic Nebula Fragment Shader
export const cosmicFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uMouse;
  uniform float uScroll;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uOpacity;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vDisplacement;
  
  void main() {
    // Color mixing based on displacement and position
    float mixFactor = smoothstep(-1.0, 1.0, vDisplacement);
    float mixFactor2 = smoothstep(-0.5, 0.5, sin(vPosition.x * 0.5 + uTime * 0.3));
    
    vec3 color = mix(uColor1, uColor2, mixFactor);
    color = mix(color, uColor3, mixFactor2 * 0.5);
    
    // Add glow at peaks
    float glow = smoothstep(0.3, 1.0, vDisplacement) * 0.6;
    color += glow * uColor3;
    
    // Edge fade
    float edgeFade = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
    edgeFade *= smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
    
    // Fresnel-like effect
    float fresnel = pow(1.0 - abs(dot(normalize(vPosition), vec3(0.0, 0.0, 1.0))), 2.0);
    color += fresnel * uColor2 * 0.3;
    
    gl_FragColor = vec4(color, edgeFade * uOpacity * (0.6 + glow));
  }
`;

// Particle system vertex shader
export const particleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  
  attribute float aScale;
  attribute float aSpeed;
  
  varying float vAlpha;
  
  void main() {
    vec3 pos = position;
    
    // Animate particles
    pos.y += sin(uTime * aSpeed + pos.x * 2.0) * 0.5;
    pos.x += cos(uTime * aSpeed * 0.7 + pos.z * 1.5) * 0.3;
    pos.z += sin(uTime * aSpeed * 0.5) * 0.4;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    gl_PointSize = uSize * aScale * uPixelRatio * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    
    // Fade based on distance
    vAlpha = smoothstep(50.0, 5.0, -mvPosition.z);
  }
`;

export const particleFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  
  varying float vAlpha;
  
  void main() {
    // Circle shape
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha * 0.6;
    gl_FragColor = vec4(uColor, alpha);
  }
`;
