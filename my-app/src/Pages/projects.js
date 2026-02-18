import React from "react";
import ProjectGallery from "../components/Gallery";
import './basepages.css'
import "./projects.css"


export default class Projects extends React.Component {
    render(){
        return(
            <div className="mainBody">
            <h1> Collection of Projects </h1>
            <ProjectGallery/>

            <div className="seperator"> </div>
            <div id="projectDescriptions"> 
                <div id="project1">
                    <h3> Gitaxian Probe  & Strategic Sorcery - AI Models for Magic: The Gathering </h3>
                    <p> A MTG Inspirted Course Project. An exploration of the different AI models and their applicability on the Magic The Gathering domain. We eventually expanded on this topic, specifically the automated planning section. Presenting this paper in the ICAPS 2024 confrence. </p>

                    <a  href="https://github.com/NicholasTillo/Gitaxian-Probe"> Project Link </a> 


                    <a href="https://openreview.net/pdf?id=bZeQ7DB0T9"> ICAPS 2024 Paper Link </a>
                    


                </div>
                <div className="seperator"> </div>
                <div id="project2">
                    <h3> Extraterrestrial Entertainment </h3>
                    <p> A course project for CISC 486 - Game Development, A game about aliens, langauge, and jokes. </p>
                    <a href="https://github.com/kabeeradil03/CISC486GD-extraterrestrial-entertainment"> Github Link </a>

                    <a href=" https://youtu.be/yV3j3jQtLQs"> Video Of Player Movement and Aliens </a>

                    <a href="https://youtu.be/9dVxzEknoJY"> Demo of Gameplay and FSM Logic </a>

                    <a href="https://www.youtube.com/watch?v=O5wmU3lJKOU"> Video Of Pathfinding and Behaviour Tree </a>



                </div>
                <div className="seperator"> </div>
                <div id="project3">
                    <h3> CounterFactual Map-Elite algorithm </h3>
                    <p> A Quality Diversity counterfactual generation proof of concept using the MAP-Elites algorithm. This Python-based project features a GUI for generating diverse, actionable counterfactual explanations for machine learning models. Users can preprocess data, configure parameters, and interactively explore counterfactuals through a visual grid-based interface. </p>
                    <a href="https://github.com/NicholasTillo/CounterFactual"> Repository Link </a>
                </div>
                <div className="seperator"> </div>
                <div id="project4">
                    <h3> The Geomancer's Escape </h3>
                    <p> A Unity game made for a course project, CISC 223 - Game Design. A game about a 2D player attempting to return back to three dimensions, fighting though worlds, exploring, and dodging enemies that are able to move between the 2D and 3D realms.</p>
                    <a href="https://github.com/NicholasTillo/TheGeomancersEscape"> Repository Link </a>
                    <a href="https://nicholastillo.itch.io/the-geomancers-escape"> Itch Link </a>


                </div>
                <div className="seperator"> </div>
                <div id="project5">
                    <h3> project5 </h3>
                    <p> description 5</p>
                </div>
                <div className="seperator"> </div>
                <div id="project6">
                    <h3> project6 </h3>
                    <p> description 6</p>
                </div>
                <div className="seperator"> </div>
                <div id="project7">
                    <h3> project7 </h3>
                    <p> description 7</p>
                </div>
                <div className="seperator"> </div>
            </div>
        </div>
            
            )
    }
}
    
