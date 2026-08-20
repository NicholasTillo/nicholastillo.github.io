import React from "react";
import Github from "../Assets/github.png"
import Gmail from "../Assets/gmail.gif"

import Pauper from "../Assets/playpauper2.gif"
import Gamer from "../Assets/games.gif"


const asciiArt = [
    "(-'.'-)",
    "<( c(-_-c)'.')>",
    "Q('.'Q)",
    "<('.'<)",
    "c(','c)",
    "v(-'.'-)^",
    "(>^_^)>",
    "(v-'.'-v)",
    "<(^.^)>",
];


export default class Leftbox extends React.Component {
    render() {
        const art = asciiArt[Math.floor(Math.random() * asciiArt.length)];

        return (
            <div className="sidebox leftbox">
                <div className="links">
                    <p> Real Links </p>
                    <div className="buttonSlot">
                        <a href="https://www.linkedin.com/in/nicholastillo/" target="_blank" rel="noopener noreferrer"> <img src="Assets/linkedin-icon.png" alt="LinkedIn" /> </a>
                    </div>
                    <div className="buttonSlot">
                        <a href="https://nicholastillo.itch.io" target="_blank" rel="noopener noreferrer"> <img src="Assets/itchio-icon.png" alt="Itch.io" /> </a>
                    </div>
                    <div className="buttonSlot">
                        <a href="https://github.com/NicholasTillo" target="_blank" rel="noopener noreferrer"> <img src={Github} alt="GitHub" /> </a>
                    </div>
                </div>

                <div className="links">
                    <p> Contact </p>
                    <div className="buttonSlot">
                        <a href="mailto:nicholastillo@gmail.com"> <img src={Gmail} alt="Email" /> </a>
                    </div>
                </div>
                <div className="links" style={{ textAlign: "center" }}>
                     <p>{art}</p>
                </div>

                <div className="links">
                    <p> Stupid Links </p>
                    <div className="buttonSlot">
                        <a href="https://cubecobra.com/cube/overview/QBert" target="_blank" rel="noopener noreferrer"> <img src={Pauper} alt="MTGCube" /> </a>
                    </div>
                    <div className="buttonSlot">
                        <a href="https://backloggd.com/u/PukMen/" target="_blank" rel="noopener noreferrer"> <img src={Gamer} alt="Backloggd" /> </a>
                    </div>
                </div>


                <div className="seperator"> </div>

                

                
                
            </div>
        );
    }
}
