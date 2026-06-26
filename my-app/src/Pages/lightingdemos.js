import React from "react";
import './basepages.css'
import './lightingdemos.css'
import { Canvas , useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'


function RotatingStandardMesh() {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.6
  })
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[0.4, 0.14, 128, 16]} />
      <meshStandardMaterial color="#3a7ae0" />
    </mesh>
  )
}

function RotatingPhongMesh() {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.6
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.6, 0]} />
      <meshPhongMaterial color="#3a7ae0" />
    </mesh>
  )
}

function RotatingRefractionMesh() {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.6
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.42, 0.18, 24, 64]} />
      <meshToonMaterial color="#3a7ae0"/>
    </mesh>
  )
}


export default class LightingDemos extends React.Component {
    render(){
        return(
            <div className="mainBody">
                <h1 className="PageTitle">Lighting Demos</h1>
                <p>This page will contain WebGL lighting demonstrations in the future as I learn more lighting techniques that I want to implement.</p>

                <div className="lightingContainer">
                    <div className="lightingPanel red">
                        <div className="lightingCanvasWrapper">
                          <p>Standard Shading Example</p>

                            <Canvas className="lightingCanvas" camera={{ position: [0, 0, 2.2], fov: 60 }} frameloop="demand">
                                <ambientLight intensity={0.4} />
                                <directionalLight position={[1, 1.5, 0.8]} intensity={1} />
                                <RotatingPhongMesh />
                                <OrbitControls />
                            </Canvas>
                        </div>
                    </div>
                    <div className="lightingPanel green">
                        <div className="lightingCanvasWrapper">
                          <p>Phong Shading Example</p>

                            <Canvas className="lightingCanvas" camera={{ position: [0, 0, 2.2], fov: 60 }} frameloop="demand">
                                <ambientLight intensity={0.4} />
                                <directionalLight position={[1, 1.5, 0.8]} intensity={1} />
                                <RotatingStandardMesh />
                                <OrbitControls />
                            </Canvas>
                        </div>
                    </div>
                    <div className="lightingPanel blue">
                        <div className="lightingCanvasWrapper">
                          <p>Toon Shading Example</p>
                            <Canvas className="lightingCanvas" camera={{ position: [0, 0, 2.2], fov: 60 }} frameloop="demand">
                                <ambientLight intensity={0.4} />
                                <directionalLight position={[1, 1.5, 0.8]} intensity={1} />
                                <RotatingRefractionMesh />
                                <OrbitControls />
                            </Canvas>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}