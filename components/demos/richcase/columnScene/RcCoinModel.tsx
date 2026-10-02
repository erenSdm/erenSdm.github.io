"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo, forwardRef, JSX } from "react";
import * as THREE from "three";
import type { Object3D } from "three";

type RcCoinModelProps = JSX.IntrinsicElements["group"] & {
    scale?: number | [number, number, number];
};

export const RcCoinModel = forwardRef<THREE.Group, RcCoinModelProps>(
    function RcCoinModel(props, ref) {
        const { scene } = useGLTF("/demos/richcase/models/rc-coin-v3.glb");

        const coinClone = useMemo(() => {
            const clone: Object3D = scene.clone(true);

            // Coin'in kendi parıltısını / emissive'ini kıs
            clone.traverse((child) => {
                const mesh = child as THREE.Mesh;
                if (!mesh.isMesh) return;

                const mat = mesh.material as THREE.MeshStandardMaterial;
                if (!mat) return;


            });

            // Başlangıç rotasyonu
            clone.rotation.set(Math.PI / 2, 0, Math.PI / 2);

            return clone;
        }, [scene]);

        return (
            <group ref={ref} {...props}>
                <primitive object={coinClone} />
            </group>
        );
    }
);

useGLTF.preload("/demos/richcase/models/rc-coin-v3.glb");