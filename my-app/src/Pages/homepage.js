import React from "react";
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import mugi from '../Assets/mugi.png'

import Fight from '../Assets/Fight.png'
import Mercy from '../Assets/Mercy.png'
import Act from '../Assets/Act.png'
import Item from '../Assets/Item.png'

import Fight_Selected from '../Assets/Fight_Selected.png'
import Mercy_Selected from '../Assets/Mercy_Selected.png'
import Act_Selected from '../Assets/Act_Selected.png'
import Item_Selected from '../Assets/Item_Selected.png'

import Slash from '../Assets/Slash.gif'
import Carrot from '../Assets/carrot.gif'

import "./homepage.css"

function RotatingWebGLMesh() {
  const ref = useRef()
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.6
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.55, 28, 28]} />
      <meshStandardMaterial color="#ff6666" />
    </mesh>
  )
}

export default class Homepage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mainBody">
                <h1>Welcome to my website!</h1>
                <p>This is a place where I share my projects and some cool stuff. Feel free to explore and check out the different sections using the navigation bar above.</p>
                <h2> Professional Stuff </h2>
                <p> </p>
            </div>
    );

    }
}
