import React from "react";
import './basepages.css'
import FUBnyu from "../Assets/FUBnyu.jpg"
import { Link } from "react-router";

export default class Page3 extends React.Component {
    render(){
        return(
            <div className="mainBody">
            
            
            <h1> Miscellaneous Hobbies and Projects</h1>

            <div className="gamingShowcase">
           <h2>Gaming Showcase</h2> 

            <h3> Binding Of Issac </h3>
            <p> Bunny Resprite for The Binding Of Issac </p>
            <Link style={{margin: 10}} smooth to="https://steamcommunity.com/sharedfiles/filedetails/?id=3537671862">
                      <img src={FUBnyu} />
                    </Link>
            <p> Currently on the steam community page for The Binding Of Issac, just a simple retexture for the troll bombs to be bunnies instead! This is kinda my first dips into Issac modding and want to do much more in the future.</p>
            </div>


            <div className="rotomShowcase">
                <h2> Rotom Tamagatchi Project </h2>
                <p> I made a rotom inspired Tamagatchi using a Arduino Nano, and a mini screen.</p>
            </div>
            <div className="HKMTGShowcase">
                <h2> Hollow Knight MTG Set</h2>
                <p> Implementing a custom Hollow Knight MTG set for use in cockatrice and draftmancer.  https://github.com/NicholasTillo/HK-MTG-Set </p>
            </div>
            <div className="figureShowcase">
                <h2> Painted Minifigures </h2>
                <p> I also paint some minifigures, I actually got a 3d printer just to have things to paint for cheap. I have an instagram <a style={{padding:0,margin:0}} href="https://www.instagram.com/tillosfigures/">@tillosfigure/</a> to help showcase the figures ive printed, and painted! Here are some favourites: </p>
            </div>
            
            <div className="rakshaShowcase">
                <h2>Art Showcase</h2>
                <p> My girlfriend makes incredible art, heres a showcase of some of the things that she does <a style={{padding:0,margin:0}} href="https://www.instagram.com/r4ksha/">@r4ksha/</a>. </p>

            </div>
            </div>
            )
    }
}
    
