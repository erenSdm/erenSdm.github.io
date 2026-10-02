"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ColumnModel } from "./ColumnModel";

export default function ColumnsScene() {
    // Şimdilik tek kolon; önce tam ekran sorunsuz mu onu görelim
    return (
        <div className="w-screen h-screen">
            <Canvas
                style={{ width: "100%", height: "100%" }}
                camera={{ position: [0, 2, 8], fov: 45 }}
            >
                <color attach="background" args={["#050505"]} />

                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1.2} />

                <ColumnModel position={[0, 0, 0]} scale={0.5} />

                <OrbitControls />
            </Canvas>
        </div>
    );
}