"use client";

import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import {
  DESKTOP_POSES,
  MOBILE_POSES,
  POSE_KEYS,
  STAGES,
  type Pose,
  type ScrollState,
} from "./stages";

const SLICES = 5;
const W = 1.0;
const H = 2.25; // 4:9 — the monolith ratio
const D = 0.42;
const SLICE_H = H / SLICES;

const LIME = new THREE.Color("#ccff00");
const WHITE = new THREE.Color("#ffffff");
const INK = new THREE.Color("#0a0a0a");
const CLEAR_ATT = new THREE.Color("#f4fbff");
const LIME_ATT = new THREE.Color("#d8ff4a");
const BEAM_CORE = new THREE.Color("#f4ffc8").multiplyScalar(2.2);

/** Deterministic per-shard randomness, −1..1. */
function seeded(i: number, k: number) {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
}

/**
 * Draw this mesh only into three.js's transmission buffer (what glass refracts), never on screen.
 * The renderer applies material state after onBeforeRender, so toggling colorWrite here is enough.
 */
function transmissionOnly(
  renderer: THREE.WebGLRenderer,
  _scene: THREE.Scene,
  _camera: THREE.Camera,
  _geometry: THREE.BufferGeometry,
  material: THREE.Material,
) {
  material.colorWrite = renderer.getRenderTarget() !== null;
}

function gradientTexture(kind: "core" | "beam") {
  const c = document.createElement("canvas");
  c.width = kind === "core" ? 64 : 256;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  if (kind === "core") {
    ctx.translate(32, 128);
    ctx.scale(0.25, 1);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 128);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(-128, -128, 256, 256);
  } else {
    // soft along both axes: bright centre line, fades towards the ends
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "rgba(255,255,255,0)");
    g.addColorStop(0.5, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    ctx.globalCompositeOperation = "destination-in";
    const h = ctx.createLinearGradient(0, 0, 256, 0);
    h.addColorStop(0, "rgba(255,255,255,0)");
    h.addColorStop(0.35, "rgba(255,255,255,1)");
    h.addColorStop(0.65, "rgba(255,255,255,1)");
    h.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = h;
    ctx.fillRect(0, 0, 256, 256);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

type Props = {
  state: RefObject<ScrollState>;
  reduced: boolean;
  lowPower: boolean;
};

export default function PrismScene({ state: stateRef, reduced, lowPower }: Props) {
  const root = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const stretch = useRef<THREE.Group>(null);
  const shards = useRef<(THREE.Group | null)[]>([]);
  const glassMats = useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);
  const lineMats = useRef<(THREE.LineBasicMaterial | null)[]>([]);
  const core = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null);
  const beam = useRef<THREE.Group>(null);
  const beamCore = useRef<THREE.Mesh>(null);
  const beamGlowMat = useRef<THREE.MeshBasicMaterial>(null);
  const backdropMat = useRef<THREE.MeshBasicMaterial>(null);
  const haloMat = useRef<THREE.MeshBasicMaterial>(null);

  const isPhone = useThree((s) => s.size.width < 768);

  const cur = useRef<Pose>({ ...(isPhone ? MOBILE_POSES : DESKTOP_POSES).hero });
  const target = useRef<Pose>({ ...(isPhone ? MOBILE_POSES : DESKTOP_POSES).hero });
  const extra = useRef({ spin: 0, step: 0, light: 0, mx: 0, my: 0, t: 0 });
  const tmpColor = useRef(new THREE.Color());

  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(W, SLICE_H, D)),
    [],
  );
  const coreTex = useMemo(() => gradientTexture("core"), []);
  const beamTex = useMemo(() => gradientTexture("beam"), []);

  useFrame((frame, rawDt) => {
    const state = stateRef.current;
    const dt = Math.min(rawDt, 1 / 20);
    const poses = isPhone ? MOBILE_POSES : DESKTOP_POSES;
    const A = poses[STAGES[state.a]];
    const B = poses[STAGES[state.b]];
    const t = target.current;
    for (const k of POSE_KEYS) t[k] = A[k] + (B[k] - A[k]) * state.w;

    const c = cur.current;
    const e = extra.current;
    const lambda = reduced ? 1000 : 3.2;
    for (const k of POSE_KEYS) c[k] = THREE.MathUtils.damp(c[k], t[k], lambda, dt);
    e.step = THREE.MathUtils.damp(e.step, state.step, reduced ? 1000 : 4, dt);
    e.light = THREE.MathUtils.damp(e.light, state.light, reduced ? 1000 : 5, dt);
    if (!reduced) {
      e.mx = THREE.MathUtils.damp(e.mx, state.mx, 2.5, dt);
      e.my = THREE.MathUtils.damp(e.my, state.my, 2.5, dt);
      e.spin += c.spin * dt;
      // Stages with ~no spin square up to the nearest face so their pose is deterministic.
      const settle = 1 - Math.min(1, c.spin / 0.08);
      if (settle > 0) {
        e.spin = THREE.MathUtils.damp(e.spin, Math.round(e.spin / Math.PI) * Math.PI, 2.5 * settle, dt);
      }
      e.t += dt;
    }

    const vp = frame.viewport;
    const float = reduced ? 0 : Math.sin(e.t * 0.8) * 0.06;

    if (root.current) {
      root.current.position.set(
        c.x * (vp.width / 2) + e.mx * 0.12,
        c.y * (vp.height / 2) + float - e.my * 0.08,
        c.z,
      );
      // keep size sane on short or narrow viewports
      const fit = Math.min(1, vp.height / 3.6, vp.width / 2.4);
      root.current.scale.setScalar(c.s * fit);
    }
    if (spinner.current) {
      spinner.current.rotation.set(
        c.rx + e.my * 0.12 + (reduced ? 0 : Math.sin(e.t * 0.5) * 0.04),
        c.ry + e.spin + e.step * Math.PI + e.mx * 0.22,
        c.rz,
      );
    }
    if (stretch.current) stretch.current.scale.set(c.wide, 1, c.thin);

    const light = e.light;
    const col = tmpColor.current;
    col.copy(WHITE).lerp(INK, light).lerp(LIME, Math.max(c.tint * 0.85, c.wire * 0.9));
    if (light > 0.5 && c.wire > 0.5) col.lerp(INK, 0.55); // lime lines read poorly on white

    for (let i = 0; i < SLICES; i++) {
      const g = shards.current[i];
      const sp = c.split;
      if (g) {
        const mid = i - (SLICES - 1) / 2;
        const drift = reduced ? 0 : Math.sin(e.t * 0.6 + i * 1.7) * 0.06;
        g.position.set(
          seeded(i, 1) * 0.55 * sp,
          mid * SLICE_H + mid * 0.2 * sp + drift * sp,
          seeded(i, 2) * 0.7 * sp,
        );
        g.rotation.set(
          seeded(i, 3) * 0.7 * sp,
          seeded(i, 4) * 0.9 * sp + e.t * 0.15 * seeded(i, 5) * sp,
          seeded(i, 6) * 0.5 * sp,
        );
      }
      const gm = glassMats.current[i];
      if (gm) {
        gm.opacity = 1 - 0.92 * c.wire;
        gm.attenuationColor.copy(CLEAR_ATT).lerp(LIME_ATT, c.tint);
        gm.iridescence = 0.35 + 0.4 * c.tint;
        gm.envMapIntensity = 2.2 - 0.7 * light;
      }
      const lm = lineMats.current[i];
      if (lm) {
        lm.color.copy(col);
        lm.opacity = 0.16 + 0.3 * light * (1 - c.wire) + 0.74 * c.wire;
      }
    }

    if (core.current && coreMat.current) {
      const o = c.glow * (1 - c.split) * (1 - c.wire) * (1 - 0.6 * light);
      coreMat.current.opacity = o * 0.75;
      core.current.visible = o > 0.01;
    }

    if (backdropMat.current) {
      backdropMat.current.color.setRGB(state.bg[0], state.bg[1], state.bg[2], THREE.SRGBColorSpace);
    }

    if (haloMat.current) haloMat.current.opacity = (0.14 + 0.22 * c.glow) * (1 - c.wire) * (1 - 0.5 * light);

    if (beam.current) {
      const b = c.beam * (1 - c.wire);
      beam.current.visible = b > 0.01;
      beam.current.scale.y = Math.max(b, 0.001);
      if (beamGlowMat.current) beamGlowMat.current.opacity = 0.26 * b * (1 - 0.7 * light);
      if (beamCore.current) beamCore.current.visible = b > 0.05 && light < 0.6;
    }
  });

  return (
    <>
      <Environment resolution={lowPower ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 5, -2]} scale={[10, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={4} color="#ffffff" position={[-5, 1, 1]} scale={[0.6, 8, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[5, -1, 1]} scale={[0.4, 8, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={2.2} color="#ccff00" position={[2, -4, 3]} scale={[6, 0.6, 1]} rotation-x={-Math.PI / 3} />
        <Lightformer form="ring" intensity={1.5} color="#bfe8ff" position={[-2, 2, 5]} scale={2} />
      </Environment>

      {/*
        Backdrop that only exists inside the transmission pass. With a transparent canvas three.js
        clears that buffer to 50% white, which makes glass look like flat grey plastic; this plane
        paints the sampled page colour instead, and is colour-masked out of the on-screen pass.
      */}
      <mesh
        position={[0, 0, -8]}
        renderOrder={-10}
        onBeforeRender={transmissionOnly}
      >
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial ref={backdropMat} color="#0a0a0a" depthWrite={false} toneMapped={false} />
      </mesh>

      <group ref={root}>
        {/* soft halo behind the slab — only seen through the glass, gives it an inner luminance */}
        {/* opaque-list + additive: the transmission pass only renders the opaque list */}
        <mesh position={[0, 0.1, -1.6]} renderOrder={-5} onBeforeRender={transmissionOnly}>
          <planeGeometry args={[4.2, 5.4]} />
          <meshBasicMaterial
            ref={haloMat}
            map={coreTex}
            color="#e4ebf2"
            transparent={false}
            blending={THREE.AdditiveBlending}
            opacity={0.55}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* light beam behind the slab */}
        <group ref={beam} position={[0, -0.15, -1.1]} rotation-z={-0.32}>
          {/* opaque core → lands in the transmission pass, so the glass refracts + disperses it */}
          <mesh ref={beamCore} onBeforeRender={transmissionOnly}>
            <planeGeometry args={[30, 0.016]} />
            <meshBasicMaterial color={BEAM_CORE} toneMapped={false} />
          </mesh>
          <mesh>
            <planeGeometry args={[16, 0.42]} />
            <meshBasicMaterial
              ref={beamGlowMat}
              map={beamTex}
              color="#e9ff9a"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>

        <group ref={spinner}>
          <group ref={stretch}>
            {Array.from({ length: SLICES }, (_, i) => (
              <group
                key={i}
                ref={(el) => {
                  shards.current[i] = el;
                }}
              >
                <RoundedBox args={[W, SLICE_H, D]} radius={0.018} smoothness={2}>
                  <meshPhysicalMaterial
                    ref={(m: THREE.MeshPhysicalMaterial | null) => {
                      glassMats.current[i] = m;
                    }}
                    color="#ffffff"
                    transmission={1}
                    roughness={0.04}
                    metalness={0}
                    thickness={1.4}
                    ior={1.5}
                    dispersion={lowPower ? 2 : 6}
                    iridescence={0.35}
                    iridescenceIOR={1.25}
                    iridescenceThicknessRange={[120, 480]}
                    clearcoat={1}
                    clearcoatRoughness={0.05}
                    specularIntensity={1}
                    attenuationColor="#f4fbff"
                    attenuationDistance={3}
                    envMapIntensity={1.6}
                    transparent
                  />
                </RoundedBox>
                <lineSegments geometry={edges}>
                  <lineBasicMaterial
                    ref={(m: THREE.LineBasicMaterial | null) => {
                      lineMats.current[i] = m;
                    }}
                    color="#ffffff"
                    transparent
                    opacity={0.2}
                    depthWrite={false}
                  />
                </lineSegments>
              </group>
            ))}
            <mesh ref={core} renderOrder={2}>
              <planeGeometry args={[W * 0.9, H * 0.95]} />
              <meshBasicMaterial
                ref={coreMat}
                map={coreTex}
                depthTest={false}
                color="#ccff00"
                transparent
                opacity={0.5}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </group>
        </group>
      </group>
    </>
  );
}
