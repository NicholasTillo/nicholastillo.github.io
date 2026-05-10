import React, {useEffect, useState} from "react";
import { Canvas , useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'
import './Minesweeper.css'

var listOfSkills = ["Python", "HTML", "CSS", "Java", "Javascript", "C", "C#", "BASH", "Haskell", "Prolog", "SQL", "GDScript", "Algorithms", "Software\nArchitecture", "Operating\nSystems", "Software\nQuality\nAssurance", "Human-Computer\nInteraction", "Database\nManagement\nSystems", "Artificial\nIntelligence", "Computer\nGraphics", "Game\nDevelopment", "Software\nRequirements"]


function SingleCapsule({row, col, board}) {
  useEffect(() => console.log(`SingleCapsule ${row}-${col} function called`), [])
  const ref = useRef()
  const [color, setColor] = useState("#3a7ae0")
  const [revealed, setRevealed] = useState(false)
  

  

  const countAdjacentMines = () => {
    let sumAround = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const r = row + i
        const c = col + j
        if (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
          sumAround += board[r][c]
        }
      }
    }
    return sumAround
  }

  const handleClick = () => {
    if (revealed) return;
    const sumAround = countAdjacentMines()
    setRevealed(true)
    setColor("#d3d3d3")
  }

  const handleRightClick = (e) => {
    e.stopPropagation()
    setRevealed(false)
    setColor("#00ff00")
  }

  const adjacentMines = countAdjacentMines()

  return (
    <mesh ref={ref} rotation={[0, 0, Math.PI / 2]}position={[-5 + row * 2.5, -5 + col * 2.5, 0]} onClick={handleClick} onContextMenu={handleRightClick}>
      <capsuleGeometry args={[1, 1, 4, 8, 1 ]} />
      <meshStandardMaterial color={color} />
      {revealed && (
        <Text
          position={[0, 0, 1.1]}
          rotation={[0, 0, -1.6]}
          fontSize={0.5}
          color="black"
          anchorX="center"
          anchorY="middle"
          billboard
        >
          {adjacentMines}
        </Text>
      )}
    </mesh>
  )
}


function BombCapsule({row, col, board}) {
  useEffect(() => console.log(`BombCapsule ${row}-${col} function called`), [])
  const ref = useRef()
  const [color, setColor] = useState("#3a7ae0")
  const [revealed, setRevealed] = useState(false)
  const [flagged, setFlagged] = useState(false)

  var randNum

  const handleClick = () => {
    if (revealed) return;
    setRevealed(true)
    setFlagged(false)
    setColor("#ff0000")
  }

  const handleRightClick = (e) => {
    e.stopPropagation()
    setRevealed(false)
    setFlagged(true)
    setColor("#ffffff")
  }
  if(flagged){
  console.log(listOfSkills)
  randNum = Math.random() * listOfSkills.length | 0
  var value = listOfSkills[randNum]
  listOfSkills.splice(listOfSkills.indexOf(value), 1)
  console.log(listOfSkills)

  }
  

  
  return (
    <mesh ref={ref} rotation={[0, 0, Math.PI / 2]} position={[-5 + row * 2.5, -5 + col * 2.5, 0]} onClick={handleClick} onContextMenu={handleRightClick}>
      <capsuleGeometry args={[1, 1, 4, 8, 1 ]} />
      <meshStandardMaterial color={color} />
      {flagged && (
        <Text
          position={[0, 0, 1.1]}
          rotation={[0, 0, -Math.PI / 2]}
          fontSize={0.4}
          color="black"
          anchorX="center"
          anchorY="middle"
          billboard
          textAlign="center"
        >
          {value}
        </Text>
      )}
      {revealed && (
        <Text
          position={[0, 0, 1.1]}
          rotation={[0, 0, -Math.PI / 2]}
          fontSize={0.35}
          color="black"
          anchorX="center"
          anchorY="middle"
          billboard
          textAlign="center"
        >
          BOOM!
        </Text>
      )}
    </mesh>
  )
}


export default class Minesweeper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: null,
            started: false,
        };
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

    startGame = () => {
        this.setState({ board: this.generateBoard(), started: true });
    }

    render(){
        console.log('Minesweeper render() called')
        return(
            <div className="mainGame">
                {!this.state.started && (
                    <div className="startMenu">
                        <h1>START</h1>
                        <p>Left click to reveal each node, right click to place a flag!</p>
                        <button className="startButton" onClick={this.startGame}>Start</button>
                    </div>
                )}
                {this.state.started && this.state.board && (
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
                )}
            </div>
        );
    }
}
