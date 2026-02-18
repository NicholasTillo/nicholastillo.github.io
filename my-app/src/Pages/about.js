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
            
            <p> What information goes in a biography, story, schooling
                working
                dreams, aspirations
                maybe just put alot of links to what ive done, want to do
                keep a public fourm for notes on game ideas?  who knose? 
            </p>

            
            <div className="musicSection">
                <h2> Some Favourite Songs </h2>
                <p> Do you know if there is spotify integration? Maybe i make a song component and have a database of favourtie songs. </p>
            
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
    
