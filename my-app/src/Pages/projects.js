import React from "react";

import './basepages.css'
import "./projects.css"




export default class Projects extends React.Component {
    constructor(props){
        super(props);
        this.state = { activeSrc: null };
    }

    openLightbox = (src) => {
        this.setState({ activeSrc: src });
        document.body.style.overflow = 'hidden';
    }

    closeLightbox = () => {
        this.setState({ activeSrc: null });
        document.body.style.overflow = '';
    }

    renderImageGrid(images) {
        return (
            <div className="projectImageGrid">
                {images.map((src, idx) => (
                    <button
                        key={idx}
                        type="button"
                        className="projectImageSlot"
                        onClick={() => this.openLightbox(src)}
                    >
                        <img src={src} alt={`Project image ${idx + 1}`} />
                    </button>
                ))}
            </div>
        );
    }

    render(){
        const projectImages = {
            project1: [
                require("../Assets/GitProbe1.png"),
                require("../Assets/GitProbePresentation.jpg"),
            ],
            project2: [
                require("../Assets/EEBehaviourTree.png"),
                require("../Assets/ExtraterrestrialEntertainment.png")
            ],
            project3: [
                require("../Assets/CounterFactual.png"),
                require("../Assets/CounterFactual.png")
            ],
            project4: [
                require("../Assets/geomancersEscape.png"),
                require("../Assets/GeomancerEscape.png")
            ],
            project5: [
                require("../Assets/IMG_0478.PNG"),
                require("../Assets/FinishedComputationalArtworks.png"),
                require("../Assets/IMG_0462.PNG")
            ],
            project6: [
                require("../Assets/GameOfLife.png"),
            ],
            project7: [
                
            ]
        };



        return(
            <div className="mainBody">
            <h1 className="PageTitle"> Collection of Projects </h1>
            
            <div className="seperator"> </div>
            <div id="projectDescriptions"> 
                <div id="project1">
                    <h3> Gitaxian Probe  & Strategic Sorcery - AI Models for Magic: The Gathering </h3>
                    <p> A MTG Inspirted Course Project. An exploration of the different AI models and their applicability on the Magic The Gathering domain. 
                        We eventually expanded on this topic, specifically the automated planning section. Presenting this paper in the ICAPS 2024 confrence. </p>

                    <a className="OuterLink" href="https://github.com/NicholasTillo/Gitaxian-Probe"> Project Link </a> 


                    <a className="OuterLink" href="https://openreview.net/pdf?id=bZeQ7DB0T9"> ICAPS 2024 Paper Link </a>

                    {this.renderImageGrid(projectImages.project1)}
                </div>
                <div className="seperator"> </div>
                <div id="project2">
                    <h3> Extraterrestrial Entertainment </h3>
                    <p> A course project for CISC 486 - Game Development, A game about aliens, langauge, and jokes. </p>
                    <a className="OuterLink" href="https://github.com/kabeeradil03/CISC486GD-extraterrestrial-entertainment"> Github Link </a>

                    <a className="OuterLink" href="https://youtu.be/yV3j3jQtLQs"> Video Of Player Movement and Aliens </a>

                    <a className="OuterLink" href="https://youtu.be/9dVxzEknoJY"> Demo of Gameplay and FSM Logic </a>

                    <a className="OuterLink" href="https://www.youtube.com/watch?v=O5wmU3lJKOU"> Video Of Pathfinding and Behaviour Tree </a>

                    <a className="OuterLink" href={require("../Assets/CISC 486 - Group 6 Presentation.pptx")} target="_blank" rel="noopener noreferrer"> Final Powerpoint Presentation </a>

                    {this.renderImageGrid(projectImages.project2)}

                </div>
                <div className="seperator"> </div>
                <div id="project3">
                    <h3> CounterFactual Map-Elite algorithm </h3>
                    <p> A Quality Diversity counterfactual generation proof of concept using the MAP-Elites algorithm. This Python-based project features a GUI for generating diverse, actionable counterfactual explanations for machine learning models. Users can preprocess data, configure parameters, and interactively explore counterfactuals through a visual grid-based interface. </p>
                    <a className="OuterLink" href="https://github.com/NicholasTillo/CounterFactual"> Repository Link </a>

                    {this.renderImageGrid(projectImages.project3)}
                </div>
                <div className="seperator"> </div>
                <div id="project4">
                    <h3> The Geomancer's Escape </h3>
                    <p> A Unity game made for a course project, CISC 223 - Game Design. A game about a 2D player attempting to return back to three dimensions, fighting though worlds, exploring, and dodging enemies that are able to move between the 2D and 3D realms.</p>
                    <a className="OuterLink" href="https://github.com/NicholasTillo/TheGeomancersEscape"> Repository Link </a>
                    <a className="OuterLink" href="https://nicholastillo.itch.io/the-geomancers-escape"> Itch Link </a>

                    {this.renderImageGrid(projectImages.project4)}
                </div>
                <div className="seperator"> </div>
                <div id="project5">
                    <h3> Capstone Project - Computational Artwork for the MuLab </h3>
                    <p> This project was a set of 3 full sized canvases meant to spread the research of the graduate students within the MuLab and present the key concepts in a novel way. 
                        The 3 art pieces contain a mix of acrylic paintings, spray coloured mediums and mixed media elements. The concepts covered by the artworks were RP-BDI planning, a multi-agent epistemic planning model aimed to make planning more human. 
                        Next was a novel neural net approach to the classic cops and robbers graph theory problem. Finally, the last piece was regarding using AI automated planning for safety features on spacecrafts.  
                    </p>
                    <a className="OuterLink" href="https://drive.google.com/file/d/110QHDawwi864MMwkK79G3pvBGZB0s9WW/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                        Final Report For The Project
                    </a>

                    {this.renderImageGrid(projectImages.project5)}
                </div>
                <div className="seperator"> </div>
                
                <div id="project6">
                    <h3> Conway's Game Of Life Solver </h3>
                    <p> A course project using python to model the zero player game The Game Of Life. 
                        Given a fully initialized starting state, it will attempt to solve whether or not the pattern will result in a stable state, or not. 
                        Using python and the SAT solver - kissat to solve the state space that is set up in the file.  </p>
                    <a className="OuterLink" href="https://github.com/NicholasTillo/GameOfLifeSolver"> Repository Link </a>
                    <a className="OuterLink" href="https://github.com/NicholasTillo/GameOfLifeSolver/blob/main/documents/final/GRP_13%20ModellingProject%20-%20Documentation.pdf"> Documentation Link </a>

                    {this.renderImageGrid(projectImages.project6)}
                </div>
                <div className="seperator"> </div>

                <div id="project7">
                    <h3> Upcoming </h3>
                    <p> Upcoming</p>
                    {this.renderImageGrid(projectImages.project7)}
                </div>
                <div className="seperator"> </div>

            </div>

            {this.state.activeSrc && (
                <div className="projectLightboxOverlay" onClick={this.closeLightbox}>
                    <img src={this.state.activeSrc} className="projectLightboxImage" alt="enlarged project" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </div>
            
            )
    }
}
    
