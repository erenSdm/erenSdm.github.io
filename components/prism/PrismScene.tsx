"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";

export type HeroState = {
  /** 0 = hero fully in view, 1 = scrolled past the hero */
  p: number;
  /** pointer, −1..1 */
  mx: number;
  my: number;
};

/* ------------------------------------------------------------------ geometry */

const S = 1.3; // cube edge
const H = S / 2;
const RADIUS = 0.05;

/* ------------------------------------------------------------------ optics */

const RAYS = 22;
/** n(λ) from red (i=0) to violet (i=RAYS-1). Slightly exaggerated so the fan reads on screen. */
const IOR_RED = 1.495;
const IOR_VIOLET = 1.66;
const FAN_LEN = 9;
/**
 * A cube has parallel faces, so physically the exit rays leave almost parallel (tiny fan).
 * This adds an artistic angular spread on exit, ordered red → violet like a real prism, on top of the traced path.
 */
const FAN_SPREAD = 0.5;
// steep, from the upper left: clears the headline column
const BEAM_DIR = new THREE.Vector2(0.72, -1).normalize();
const BEAM_AIM_Y = 0.12;

type V2 = THREE.Vector2;

/** Visible-spectrum colour for t∈[0,1] (0 = 680nm red, 1 = 400nm violet). */
function spectrum(t: number, out: THREE.Color) {
  const wl = 680 - t * 280;
  let r = 0, g = 0, b = 0;
  if (wl < 440) { r = -(wl - 440) / 40; b = 1; }
  else if (wl < 490) { g = (wl - 440) / 50; b = 1; }
  else if (wl < 510) { g = 1; b = -(wl - 510) / 20; }
  else if (wl < 580) { r = (wl - 510) / 70; g = 1; }
  else if (wl < 645) { r = 1; g = -(wl - 645) / 65; }
  else r = 1;
  const edge = wl < 420 ? 0.4 + (0.6 * (wl - 400)) / 20 : wl > 660 ? 0.4 + (0.6 * (680 - wl)) / 20 : 1;
  return out.setRGB(r * edge, g * edge, b * edge);
}

/** Ray vs axis-aligned square [-H,H]². Returns near/far t and outward normals. */
function slab(o: V2, d: V2) {
  let tN = -Infinity, tF = Infinity;
  const nN = new THREE.Vector2(), nF = new THREE.Vector2();
  for (const ax of ["x", "y"] as const) {
    if (Math.abs(d[ax]) < 1e-9) {
      if (Math.abs(o[ax]) > H) return null;
      continue;
    }
    let t1 = (-H - o[ax]) / d[ax], t2 = (H - o[ax]) / d[ax];
    let s1 = -1, s2 = 1;
    if (t1 > t2) { [t1, t2] = [t2, t1]; [s1, s2] = [s2, s1]; }
    if (t1 > tN) { tN = t1; nN.set(0, 0); nN[ax] = s1; }
    if (t2 < tF) { tF = t2; nF.set(0, 0); nF[ax] = s2; }
  }
  if (tN > tF || tF < 0) return null;
  return { tN, tF, nN, nF };
}

/** Snell refraction. n faces against d. Returns null on total internal reflection. */
function refract(d: V2, n: V2, eta: number) {
  const cosi = -d.dot(n);
  const k = 1 - eta * eta * (1 - cosi * cosi);
  if (k < 0) return null;
  return d.clone().multiplyScalar(eta).add(n.clone().multiplyScalar(eta * cosi - Math.sqrt(k))).normalize();
}

const reflect = (d: V2, n: V2) => d.clone().sub(n.clone().multiplyScalar(2 * d.dot(n)));

/** Outward normal of the square face a local point sits on. */
function faceNormal(q: V2) {
  return Math.abs(q.x) > Math.abs(q.y)
    ? new THREE.Vector2(Math.sign(q.x), 0)
    : new THREE.Vector2(0, Math.sign(q.y));
}

/* ------------------------------------------------------------------ shaders */

const lightVertex = /* glsl */ `
  attribute vec3 aColor;
  attribute float aA;
  attribute float aS;
  attribute float aK;
  varying vec3 vColor;
  varying float vA;
  varying float vS;
  varying float vK;
  void main() {
    vColor = aColor; vA = aA; vS = aS; vK = aK;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const lightFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vA;
  varying float vS;
  varying float vK;
  void main() {
    float f = pow(max(sin(3.14159265 * vS), 0.0), vK);
    gl_FragColor = vec4(vColor, vA * f);
  }
`;

/** Screen position from clip space, so the backdrop lines up on screen and inside the glass's refraction buffer. */
const screenVertex = /* glsl */ `
  varying vec4 vClip;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vClip = gl_Position;
  }
`;

/** Near-black studio with a faint cool lift behind the cube. Authored in sRGB, opaque → the glass refracts it. */
const bgFragment = /* glsl */ `
  varying vec4 vClip;
  uniform float uAspect;
  uniform vec2 uGlow;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main() {
    vec2 uv = vClip.xy / vClip.w * 0.5 + 0.5;
    vec3 col = mix(vec3(0.043, 0.047, 0.058), vec3(0.03, 0.032, 0.04), uv.y);
    vec2 d = (uv - uGlow) * vec2(uAspect, 1.0);
    col += vec3(0.05, 0.055, 0.075) * exp(-dot(d, d) * 3.0);
    vec2 v = uv - 0.5;
    col *= 1.0 - dot(v, v) * 0.6;
    col += (hash(uv * 1000.0) - 0.5) * 0.008;
    gl_FragColor = vec4(pow(max(col, 0.0), vec3(2.2)), 1.0);
    #include <colorspace_fragment>
  }
`;

function radialTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ light geometry */

const MAX_VERTS = 600;

class LightBuilder {
  pos = new Float32Array(MAX_VERTS * 3);
  col = new Float32Array(MAX_VERTS * 3);
  a = new Float32Array(MAX_VERTS);
  s = new Float32Array(MAX_VERTS);
  k = new Float32Array(MAX_VERTS);
  n = 0;
  reset() {
    this.n = 0;
  }
  v(x: number, y: number, c: THREE.Color, a: number, s: number, k: number) {
    if (this.n >= MAX_VERTS) return;
    const i = this.n++;
    this.pos[i * 3] = x;
    this.pos[i * 3 + 1] = y;
    this.pos[i * 3 + 2] = 0;
    this.col[i * 3] = c.r;
    this.col[i * 3 + 1] = c.g;
    this.col[i * 3 + 2] = c.b;
    this.a[i] = a;
    this.s[i] = s;
    this.k[i] = k;
  }
  /** Soft line quad A→B of width w. */
  seg(A: V2, B: V2, w: number, c: THREE.Color, aA: number, aB: number, k: number) {
    const d = B.clone().sub(A).normalize();
    const nx = -d.y * w * 0.5, ny = d.x * w * 0.5;
    this.v(A.x - nx, A.y - ny, c, aA, 0, k);
    this.v(B.x - nx, B.y - ny, c, aB, 0, k);
    this.v(B.x + nx, B.y + ny, c, aB, 1, k);
    this.v(A.x - nx, A.y - ny, c, aA, 0, k);
    this.v(B.x + nx, B.y + ny, c, aB, 1, k);
    this.v(A.x + nx, A.y + ny, c, aA, 1, k);
  }
  /** Strip between two adjacent rays (near1→far1, near2→far2). */
  strip(n1: V2, f1: V2, n2: V2, f2: V2, c1: THREE.Color, c2: THREE.Color, an: number, af: number, s1: number, s2: number, k: number) {
    this.v(n1.x, n1.y, c1, an, s1, k);
    this.v(f1.x, f1.y, c1, af, s1, k);
    this.v(f2.x, f2.y, c2, af, s2, k);
    this.v(n1.x, n1.y, c1, an, s1, k);
    this.v(f2.x, f2.y, c2, af, s2, k);
    this.v(n2.x, n2.y, c2, an, s2, k);
  }
}

/* ------------------------------------------------------------------ scene */

type Props = {
  state: RefObject<HeroState>;
  reduced: boolean;
  lowPower: boolean;
};

export default function PrismScene({ state: stateRef, reduced, lowPower }: Props) {
  const root = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const bgMesh = useRef<THREE.Mesh>(null);
  const bgMat = useRef<THREE.ShaderMaterial>(null);
  const lightGeo = useRef<THREE.BufferGeometry>(null);
  const hotIn = useRef<THREE.Mesh>(null);
  const hotOut = useRef<THREE.Mesh>(null);
  const motion = useRef({ t: 0, mx: 0, my: 0, p: 0 });
  const proj = useRef(new THREE.Vector3());

  const isPhone = useThree((s) => s.size.width < 768);

  const builder = useMemo(() => new LightBuilder(), []);
  const glowTex = useMemo(() => radialTexture(), []);
  const bgUniforms = useMemo(
    () => ({
      uAspect: { value: 1 },
      uGlow: { value: new THREE.Vector2(0.65, 0.5) },
    }),
    [],
  );
  const tmp = useMemo(
    () => ({
      white: new THREE.Color(1, 1, 1),
      c1: new THREE.Color(),
      c2: new THREE.Color(),
      hot: new THREE.Color("#fff6ee"),
    }),
    [],
  );

  useFrame((frame, rawDt) => {
    const st = stateRef.current;
    const dt = Math.min(rawDt, 1 / 20);
    const m = motion.current;
    if (!reduced) {
      m.t += dt;
      m.mx = THREE.MathUtils.damp(m.mx, st.mx, 2.2, dt);
      m.my = THREE.MathUtils.damp(m.my, st.my, 2.2, dt);
    }
    m.p = reduced ? st.p : THREE.MathUtils.damp(m.p, st.p, 6, dt);
    const p = m.p;
    const t = m.t;

    const vp = frame.viewport;
    const fit = Math.min(1, vp.height / 3.6, vp.width / 2.6);
    const baseX = isPhone ? 0 : 0.34 * (vp.width / 2);
    const baseY = isPhone ? -0.5 * (vp.height / 2) : 0.02;
    const scale = (isPhone ? 0.52 : 0.82) * fit;

    // floating: a slow bob with a little sideways drift
    if (root.current) {
      root.current.position.set(
        baseX + Math.sin(t * 0.37) * 0.03 + m.mx * 0.1 + p * vp.width * 0.06,
        baseY + Math.sin(t * 0.8) * 0.07 - m.my * 0.06 + p * vp.height * 0.32,
        -p * 1.2,
      );
      root.current.scale.setScalar(scale * (1 - 0.25 * p));
    }

    // The cube turns about the view axis (θ) so the traced beam stays consistent with it;
    // the tilt only adds depth (left side and top just showing) and a gentle sway.
    const theta = 0.22 + Math.sin(t * 0.21) * 0.12 + m.mx * 0.05 + p * 0.9;
    if (spin.current) spin.current.rotation.z = theta;
    if (tilt.current) {
      tilt.current.rotation.set(
        0.26 + Math.sin(t * 0.43) * 0.05 + m.my * 0.05 + p * 0.5,
        0.34 + Math.sin(t * 0.31) * 0.07 + m.mx * 0.08 + p * 1.1,
        0,
      );
    }

    // ---- analytic beam: trace each wavelength through the square in its local frame
    const b = builder;
    b.reset();
    const cos = Math.cos(theta), sin = Math.sin(theta);
    const toLocal = (v: V2) => new THREE.Vector2(v.x * cos + v.y * sin, -v.x * sin + v.y * cos);
    const toWorld = (v: V2) => new THREE.Vector2(v.x * cos - v.y * sin, v.x * sin + v.y * cos);

    const aim = new THREE.Vector2(0, BEAM_AIM_Y);
    const src = aim.clone().sub(BEAM_DIR.clone().multiplyScalar(9));
    const oL = toLocal(src);
    const dL = toLocal(BEAM_DIR);
    const hit = slab(oL, dL);

    let entryW: V2 | null = null;
    let exitMidW: V2 | null = null;
    if (hit) {
      const entry = oL.clone().add(dL.clone().multiplyScalar(hit.tN));
      const eW = toWorld(entry);
      entryW = eW;
      // incoming white beam: soft glow + hot core
      b.seg(src, eW, 0.24, tmp.white, 0, 0.3, 2);
      b.seg(src, eW, 0.03, tmp.white, 0, 1, 1);

      const nears: (V2 | null)[] = [];
      const fars: (V2 | null)[] = [];
      const inner: (V2 | null)[] = [];
      for (let i = 0; i < RAYS; i++) {
        const f = i / (RAYS - 1);
        const ior = IOR_RED + (IOR_VIOLET - IOR_RED) * f;
        let d = refract(dL, hit.nN, 1 / ior);
        let o = entry.clone();
        let out: { p: V2; d: V2; din: V2 } | null = null;
        let firstHit: V2 | null = null;
        for (let bounce = 0; d && bounce < 4; bounce++) {
          const h = slab(o.clone().add(d.clone().multiplyScalar(1e-4)), d);
          if (!h) break;
          const q = o.clone().add(d.clone().multiplyScalar(h.tF + 1e-4));
          if (!firstHit) firstHit = q.clone();
          const n = faceNormal(q);
          const r = refract(d, n.clone().negate(), ior);
          if (r) {
            out = { p: q, d: r, din: d };
            break;
          }
          d = reflect(d, n); // total internal reflection
          o = q;
        }
        inner.push(firstHit ? toWorld(firstHit) : null);
        if (out) {
          const pw = toWorld(out.p);
          nears.push(pw);
          const ang = (f - 0.5) * -FAN_SPREAD;
          const od = toWorld(out.d).rotateAround(new THREE.Vector2(), ang);
          fars.push(pw.clone().add(od.multiplyScalar(FAN_LEN)));
          if (i === Math.floor(RAYS / 2)) {
            exitMidW = pw;
            // faint internal (Fresnel) reflection off the exit face
            const rd = reflect(out.din, faceNormal(out.p));
            const start = out.p.clone().add(rd.clone().multiplyScalar(1e-3));
            const rh = slab(start, rd);
            if (rh) {
              const rq = start.clone().add(rd.clone().multiplyScalar(rh.tF));
              b.seg(pw, toWorld(rq), 0.05, tmp.white, 0.18, 0.03, 1.5);
            }
          }
        } else {
          nears.push(null);
          fars.push(null);
        }
      }
      // inside the glass: the bent beam, already splitting slightly
      for (let i = 0; i < RAYS - 1; i++) {
        const a1 = inner[i], a2 = inner[i + 1];
        if (!a1 || !a2) continue;
        spectrum(i / (RAYS - 1), tmp.c1).lerp(tmp.white, 0.55);
        spectrum((i + 1) / (RAYS - 1), tmp.c2).lerp(tmp.white, 0.55);
        b.strip(eW, a1, eW, a2, tmp.c1, tmp.c2, 0.75, 0.5, i / (RAYS - 1), (i + 1) / (RAYS - 1), 0.4);
      }
      // exit fan: continuous spectrum widening with distance, soft falloff
      for (let i = 0; i < RAYS - 1; i++) {
        const n1 = nears[i], n2 = nears[i + 1], f1 = fars[i], f2 = fars[i + 1];
        if (!n1 || !n2 || !f1 || !f2) continue;
        spectrum(i / (RAYS - 1), tmp.c1).multiplyScalar(0.85);
        spectrum((i + 1) / (RAYS - 1), tmp.c2).multiplyScalar(0.85);
        b.strip(n1, f1, n2, f2, tmp.c1, tmp.c2, 0.45, 0, i / (RAYS - 1), (i + 1) / (RAYS - 1), 0.9);
      }
    }

    const g = lightGeo.current;
    if (g) {
      for (const name of ["position", "aColor", "aA", "aS", "aK"]) {
        (g.attributes[name] as THREE.BufferAttribute).needsUpdate = true;
      }
      g.setDrawRange(0, b.n);
    }

    // caustic hotspots where the beam meets the faces
    const pulse = reduced ? 1 : 0.9 + 0.1 * Math.sin(t * 3.1);
    if (hotIn.current) {
      hotIn.current.visible = !!entryW;
      if (entryW) hotIn.current.position.set(entryW.x, entryW.y, 0.01);
      hotIn.current.scale.setScalar(0.26 * pulse);
    }
    if (hotOut.current) {
      hotOut.current.visible = !!exitMidW;
      if (exitMidW) hotOut.current.position.set(exitMidW.x, exitMidW.y, 0.01);
      hotOut.current.scale.setScalar(0.3 * pulse);
    }

    if (bgMat.current && root.current) {
      const u = bgMat.current.uniforms;
      u.uAspect.value = vp.aspect;
      proj.current.setFromMatrixPosition(root.current.matrixWorld).project(frame.camera);
      u.uGlow.value.set(proj.current.x * 0.5 + 0.5, proj.current.y * 0.5 + 0.5);
    }
    if (bgMesh.current) bgMesh.current.scale.set(vp.width * 3, vp.height * 3, 1);
  });

  return (
    <>
      <Environment resolution={lowPower ? 128 : 512} frames={1}>
        {/* dark room: the glass reads through its edges and highlights, not a bright fill */}
        <color attach="background" args={["#0d0f14"]} />
        {/* overhead softbox: top face and a crisp rim along the top edges */}
        <Lightformer form="rect" intensity={6} color="#eef2ff" position={[0, 5, -0.5]} scale={[6, 3, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={14} color="#ffffff" position={[0, 4, -3]} scale={[8, 0.3, 1]} rotation-x={Math.PI / 2.6} />
        {/* key side: the beam comes from the upper left */}
        <Lightformer form="rect" intensity={10} color="#ffffff" position={[-5, 1, 0.5]} scale={[0.5, 6, 1]} rotation-y={Math.PI / 2} />
        {/* spectral side, right: tinted strips pick up the fan */}
        <Lightformer form="rect" intensity={5} color="#ff7a59" position={[5, -0.6, -0.5]} scale={[0.4, 2.5, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={5} color="#7a8cff" position={[5, 1.4, -0.5]} scale={[0.4, 2.5, 1]} rotation-y={-Math.PI / 2} />
        {/* thin front-left streak down the front face */}
        <Lightformer form="rect" intensity={4} color="#ffffff" position={[-2.4, 0.5, 5]} scale={[0.4, 6, 1]} rotation-y={-0.45} />
      </Environment>

      {/* backdrop — opaque, so it is also what the glass refracts */}
      <mesh ref={bgMesh} position={[0, 0, -5]} renderOrder={-10}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={bgMat}
          vertexShader={screenVertex}
          fragmentShader={bgFragment}
          uniforms={bgUniforms}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <group ref={root}>
        <group ref={tilt}>
          <group ref={spin}>
            <RoundedBox args={[S, S, S]} radius={RADIUS} smoothness={6} bevelSegments={6} creaseAngle={0.4}>
              <MeshTransmissionMaterial
                backside={!lowPower}
                backsideThickness={0.35}
                backsideEnvMapIntensity={0.7}
                backsideResolution={lowPower ? 256 : 768}
                samples={lowPower ? 6 : 16}
                resolution={lowPower ? 384 : 1024}
                transmission={1}
                thickness={1.1}
                roughness={0.08}
                ior={1.5}
                chromaticAberration={0.06}
                anisotropicBlur={0}
                distortion={0}
                color="#ffffff"
                attenuationColor="#f2f6fc"
                attenuationDistance={2.5}
                clearcoat={1}
                clearcoatRoughness={0.03}
                specularIntensity={1}
                envMapIntensity={1.2}
              />
            </RoundedBox>
          </group>
        </group>

        {/* analytic beam + spectrum, rebuilt every frame (the glass also refracts it) */}
        <mesh renderOrder={5} frustumCulled={false}>
          <bufferGeometry ref={lightGeo}>
            <bufferAttribute attach="attributes-position" args={[builder.pos, 3]} />
            <bufferAttribute attach="attributes-aColor" args={[builder.col, 3]} />
            <bufferAttribute attach="attributes-aA" args={[builder.a, 1]} />
            <bufferAttribute attach="attributes-aS" args={[builder.s, 1]} />
            <bufferAttribute attach="attributes-aK" args={[builder.k, 1]} />
          </bufferGeometry>
          <shaderMaterial
            vertexShader={lightVertex}
            fragmentShader={lightFragment}
            transparent
            depthWrite={false}
            depthTest={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh ref={hotIn} renderOrder={6}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={glowTex} color={tmp.hot} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} />
        </mesh>
        <mesh ref={hotOut} renderOrder={6}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={glowTex} color="#ffe9d6" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} toneMapped={false} />
        </mesh>

      </group>
    </>
  );
}
