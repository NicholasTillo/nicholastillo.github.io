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
        this.state = { hovered: null, showSlash: false, showItem: false, paragraphText: "This is Mugi, We like Mugi", attackCount: 0, showFadeScreen: false };
    }

    setHovered = (name) => this.setState({ hovered: name });

    clearHovered = () => this.setState({ hovered: null });

    fight = () => {
        const newAttackCount = this.state.attackCount + 1;
        this.setState({ attackCount: newAttackCount });
        
        if (newAttackCount === 3) {
            // Trigger fade screen on 3rd attack
            this.setState({ showFadeScreen: true });
            // After fade completes (4 seconds), reset everything
            setTimeout(() => {
                this.setState({
                    showFadeScreen: false,
                    attackCount: 0,
                    showSlash: false,
                    showItem: false,
                    paragraphText: "This is Mugi, We like Mugi"
                });
            }, 4000);
        } else {
            this.setState({ showSlash: true });
            setTimeout(() => this.setState({ showSlash: false }), 1000);
            this.changeParagraph("What, what are you doing? Stop it!");
        }
    };
    act = () =>{
        console.log("Act button clicked");  
    };
    item = () =>{
        this.setState({ showItem: true });
        setTimeout(() => this.setState({ showItem: false }), 1000);
        this.changeParagraph("Mmmm Mugi likes the carrot.");
    };
    mercy = () =>{
        console.log("Mercy button clicked");
        this.changeParagraph("Mugi is feeling merciful today.");
    };

    changeParagraph = (newText) => {
        this.setState({ paragraphText: newText });
    };


    render() {
        return (
        <div className="App">
            {this.state.showFadeScreen && (
                <div className="fade-overlay">
                    <Canvas className="fade-canvas" camera={{ position: [0, 0, 2.2], fov: 60 }} frameloop="demand">
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[1, 1.5, 0.8]} intensity={1} />
                        <RotatingWebGLMesh />
                    </Canvas>
                </div>
            )}
            <header className="App-header">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={mugi} className="App-logo" alt="logo" />
                    {this.state.showSlash && (
                        <img
                            src={Slash}
                            alt=""
                            className="slash-overlay"
                        />
                    )}
                    {this.state.showItem && (
                        <img
                            src={Carrot}
                            alt=""
                            className="item-overlay"
                        />
                    )}
                </div>
            
                <p>
                {this.state.paragraphText}
                </p>

                <div className="ActionBar">
                    <img
                        src={this.state.hovered === 'Fight' ? Fight_Selected : Fight}
                        alt="Fight"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Fight')}
                        onMouseLeave={this.clearHovered}
                        onClick={this.fight}
                    />
                    <img
                        src={this.state.hovered === 'Act' ? Act_Selected : Act}
                        alt="Act"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Act')}
                        onMouseLeave={this.clearHovered}
                        onClick={this.act}

                    />
                    <img
                        src={this.state.hovered === 'Item' ? Item_Selected : Item}
                        alt="Item"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Item')}
                        onMouseLeave={this.clearHovered}
                        onClick={this.item}

                    />
                    <img
                        src={this.state.hovered === 'Mercy' ? Mercy_Selected : Mercy}
                        alt="Mercy"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Mercy')}
                        onMouseLeave={this.clearHovered}
                        onClick={this.mercy}

                    />

                </div>
                

                
            </header>
            </div>
    );

    }
}
