import React from "react";
import { Canvas , useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import { MeshPhongMaterial } from "three";


export default class Minesweeper extends React.Component {
    render(){
        return(
            <div className="mainGame">
                <Canvas className="gameCanvas" camera={{ position: [0, 0, 2.2], fov: 60 }} frameloop="demand">
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[1, 1.5, 0.8]} intensity={1} />
                    <RotatingPhongMesh />
                    
                </Canvas>
            </div>
            );
    }
}
