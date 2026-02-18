import React from "react";
import Song from "../components/Song.js";
import './basepages.css'


import FUBnyu from '../Assets/FUBnyu.jpg';
import geomancersEscape from '../Assets/geomancersEscape.png';
import images from '../Assets/images.jpg';
import mugi from '../Assets/mugi.png';

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
                <h2> Some Favourite Songs </h2>            
                <Song/>

            </div>

            <div className="gameSection">
                <h2> Some games, but like fr check out the backloggd if you want more </h2>
                <div className="gameGrid">
                    {
                        [FUBnyu, geomancersEscape, images, mugi, FUBnyu, geomancersEscape, images, mugi].map((img, idx) => (
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
    
