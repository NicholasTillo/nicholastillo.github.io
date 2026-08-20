import React from "react";
import Steam from "../Assets/steam.gif"




export default class Rightbox extends React.Component {
    render() {
        return (
            <div className="sidebox rightbox">
               <div className="links">
                     <marquee behavior="scroll" direction="left">  Spiral staircase, Rhinoceros beetle, Desolation Row, Fig tart, Rhinoceros beetle, Via Dolorosa, Rhinoceros beetle, Singularity point, Giotto, Angel, Hydrangea, Rhinoceros beetle, Singularity point, Secret emperor </marquee>
                </div>

                <div className="links">
                    <p> About Me </p>
                    <div className="buttonSlot">
                        <a href="https://steamcommunity.com/id/PukMen1928/" target="_blank" rel="noopener noreferrer"> <img src={Steam} alt="Steam" /> </a>
                    </div>
                    <div className="buttonSlot">
                        <a href=" https://letterboxd.com/Tillo_1928/" target="_blank" rel="noopener noreferrer"> <img src="Assets/letterboxd-icon.png" alt="Movies" /> </a>
                    </div>
                </div>


                
            </div>
        );
    }
}
