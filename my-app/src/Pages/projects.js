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
                    <h3> project1 </h3>
                    <p> description 1</p>
                </div>
                <div className="seperator"> </div>
                <div id="project2">
                    <h3> project2 </h3>
                    <p> description 2</p>

                </div>
                <div className="seperator"> </div>
                <div id="project3">
                    <h3> project3</h3>
                    <p> description 3</p>
                </div>
                <div className="seperator"> </div>
                <div id="project4">
                    <h3> project4 </h3>
                    <p> description 4</p>
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
    
