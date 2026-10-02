"use client";

import { useGLTF } from "@react-three/drei";
import {useMemo, forwardRef, JSX} from "react";
import * as THREE from "three";
import type { Object3D} from "three";

type ColumnModelProps = JSX.IntrinsicElements["group"] & {
    scale?: number | [number, number, number];
};


export const ColumnModel = forwardRef<THREE.Group, ColumnModelProps>(
    function ColumnModel(props, ref) {
        const { scene } = useGLTF("/demos/richcase/models/column-v2.glb");

        const columnClone = useMemo(() => {
            const base: Object3D = scene.children[0] || scene;
            const clone = base.clone(true);


            return clone;
        }, [scene]);

        return (
            <group ref={ref} {...props}>
                <primitive object={columnClone} />
            </group>
        );
    }
);

useGLTF.preload("/demos/richcase/models/column-v2.glb");