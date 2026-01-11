import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';

const FloatingFruit = ({ position, color }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x = Math.cos(t / 4) / 2;
        meshRef.current.rotation.y = Math.sin(t / 4) / 2;
        meshRef.current.position.y = position[1] + Math.sin(t / 1.5) / 10;
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        </mesh>
    );
};

const ThreeBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 opacity-60 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <React.Suspense fallback={null}>
                    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                        <FloatingFruit position={[-3, 2, 0]} color="#ff6b6b" />
                        <FloatingFruit position={[3, -2, -2]} color="#4ecdc4" />
                        <FloatingFruit position={[-2, -3, 0]} color="#ffe66d" />
                        <FloatingFruit position={[4, 3, -5]} color="#95e1d3" />
                        <FloatingFruit position={[0, 0, -5]} color="#f7f7f7" />
                    </Float>
                </React.Suspense>
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
