import React, {useEffect, useState} from "react";
import { Canvas , useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import './Minesweeper.css'



function SingleCapsule({row, col, board}) {
  console.log(`SingleCapsule ${row}-${col} function called`)
  const ref = useRef()
  const [color, setColor] = useState("#3a7ae0")
  
    useEffect(() => {
    const q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI / 2);
    ref.current.quaternion.copy(q);
    }, [])
  
  const handleClick = () => {
    var sumAround = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (row + i >= 0 && row + i < 5 && col + j >= 0 && col + j < 5) {
                sumAround += board[row + i][col + j];
            }
        }
    }
    console.log(`Pingus, ${sumAround}`)

    setColor("#0000"+(255 - sumAround * 25).toString(16).padStart(2, '0'))
  }
  
  const handleRightClick = (e) => {
    e.stopPropagation()
    setColor("#00ff00")
  }
  
  return (
    <mesh ref={ref} position={[-5 + row * 2.5, -5 +  col * 2.5, 0]} onClick={handleClick} onContextMenu={handleRightClick}>
      <capsuleGeometry args={[1, 1, 4, 8, 1 ]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}


function BombCapsule({row, col, board}) {
  console.log(`BombCapsule ${row}-${col} function called`)
  const ref = useRef()
  const [color, setColor] = useState("#3a7ae0")

    useEffect(() => {
    const q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI / 2);
    ref.current.quaternion.copy(q);
    }, [])
  
  const handleClick = () => {
    setColor("#ff0000")
  }
  
  const handleRightClick = (e) => {
    e.stopPropagation()
    setColor("#ffffff")
  }
  
  return (
    <mesh ref={ref} position={[-5 + row * 2.5, - 5 +  col * 2.5, 0]} onClick={handleClick} onContextMenu={handleRightClick}>
      <capsuleGeometry args={[1, 1, 4, 8, 1 ]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}


export default class Minesweeper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: this.generateBoard(),
            

        };
        console.log(`Pingus, ${this.state.board}`)
    }

    generateBoard() {
        const board = [];
        for (let i = 0; i < 5; i++) {
            board[i] = [];
            for (let j = 0; j < 5; j++) {
                // Randomly assign 0 (empty) or 1 (bomb)
                // Adjust Math.random() < 0.2 to change bomb frequency (0.2 = 20% bombs)
                board[i][j] = Math.random() < 0.2 ? 1 : 0;
            }
        }
        return board;
    }
    render(){
        console.log('Minesweeper render() called')
        return(
            <div className="mainGame">
                <Canvas className="gameCanvas" camera={{ position: [0, 0, 10], fov: 75 }} frameloop="demand" onContextMenu={(e) => e.preventDefault()}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[1, 1.5, 0.8]} intensity={1} />
                    {Array.from({ length: 5 }, (_, i) =>
                        Array.from({ length: 5 }, (_, j) => (
                            this.state.board[i][j] === 1 ? (
                                <BombCapsule key={`${i}-${j}`} row={i} col={j} board={this.state.board} />
                            ) : (
                                <SingleCapsule key={`${i}-${j}`} row={i} col={j} board={this.state.board} />
                            )
                        ))
                    ).flat()}
                </Canvas>
            </div>
            );
    }
}
