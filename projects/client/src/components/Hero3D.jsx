import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Grape = (props) => {
    const group = useRef();

    // Create a cluster of spheres to resemble a grape bunch
    const spheres = [];
    const count = 15;
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 0.4 * Math.cbrt(Math.random());
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta) * 1.5; // Elongate slightly
        const z = r * Math.cos(phi);
        spheres.push([x, y - 0.2, z]);
    }

    return (
        <group ref={group} {...props}>
            {spheres.map((pos, i) => (
                <mesh key={i} position={pos}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial color="#8b5cf6" roughness={0.2} metalness={0.1} />
                </mesh>
            ))}
            {/* Stem */}
            <mesh position={[0, 0.4, 0]} rotation={[0, 0, 0.2]}>
                <cylinderGeometry args={[0.02, 0.03, 0.4, 8]} />
                <meshStandardMaterial color="#65a30d" />
            </mesh>
            {/* Leaf */}
            <mesh position={[0.1, 0.5, 0]} rotation={[0.5, 0.5, 0]}>
                <sphereGeometry args={[0.15, 32, 32]} />
                <meshStandardMaterial color="#84cc16" />
            </mesh>
        </group>
    );
};

const Orange = (props) => (
    <group {...props}>
        <mesh>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial color="#fb923c" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.2]} />
            <meshStandardMaterial color="#3f3f46" />
        </mesh>
    </group>
);

const Apple = (props) => (
    <group {...props}>
        <mesh>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial color="#ef4444" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.2]} />
            <meshStandardMaterial color="#78350f" />
        </mesh>
    </group>
);

const Hero3D = () => {
    return (
        <div className="h-[400px] w-full">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.7} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <Grape position={[0, 0, 2]} scale={1.5} />
                    <Orange position={[-2, 1, 0]} scale={1} />
                    <Apple position={[2, -1, 0]} scale={1.2} />
                    <Grape position={[2.5, 1.5, -2]} scale={1} />
                    <Orange position={[-2.5, -1.5, -1]} scale={0.8} />
                </Float>

                <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
                <Environment preset="sunset" />
            </Canvas>
        </div>
    );
};

export default Hero3D;
