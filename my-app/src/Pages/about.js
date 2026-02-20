import React from "react";
import Song from "../components/Song.js";
import './basepages.css'


import Minecraft from '../Assets/Minecraft.jpg';
import Undertale from '../Assets/Undertale.jpg';
import Wilds from '../Assets/Wilds.jpg';
import Ultrakill from '../Assets/Ultrakill.jpg';
import Issac from '../Assets/Issac.jpg';
import White from '../Assets/White.jpg';
import Inscryption from '../Assets/Inscryption.jpg';
import Knight from '../Assets/Knight.jpg';





export default class About extends React.Component {
    render(){
        return(
            <div className="mainBody">

            <h2> Biography </h2>
            
            <p> 
                Hey There! Im Nicholas Tillo, I'm an aspiring game designer and programmer. I want my future to be filled with creative endeavors and my ultimate dream is to fully produce a video game from start to finish that gets published onto steam. 
                I was born to cultivate experiences for people, I've been drawn to creating moments that change and effect peoples lives, originally through Dungeons and Dragons, but now through game design. I am based in Toronto Canada so if you are around, get in touch!  
            </p>

            
            <div className="musicSection">
                <h2> Favourite Songs Right Now </h2>            
                <Song/>

            </div>

            <div className="gameSection">
                <h2> Some games, but like fr check out the backloggd if you want more </h2>
                <div className="gameGrid">
                    {
                        [Minecraft, Undertale, Wilds, Ultrakill, Issac, White, Inscryption, Knight].map((img, idx) => (
                            <div className="gameCard" key={idx}>
                                <img src={img} alt={`game-${idx}`} />
                            </div>
                        ))
                    }
                </div>
            </div>

            </div>
            )
    }
}
    
