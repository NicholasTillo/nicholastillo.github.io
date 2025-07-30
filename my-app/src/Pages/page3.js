import React from "react";
import './basepages.css'
import FUBnyu from "../Assets/FUBnyu.jpg"
import { Link } from "react-router";

export default class Page3 extends React.Component {
    render(){
        return(
            <div className="mainBody">
            
            
            <h1> THIS IS PAGE3 </h1>
           <p> yeah dude i have no clue what to put in here, i might make some little ARG thats fun, like that calculator app I theorized about</p>

            <div className="gamingShowcase">
           <h2>Gaming Showcase</h2> 


            <h3> Binding Of Issac </h3>
            <p> Bunny Resprite for The Binding Of Issac </p>
            <Link style={{margin: 10}} smooth to="https://steamcommunity.com/sharedfiles/filedetails/?id=3537671862">
                      <img src={FUBnyu} />
                    </Link>
            </div>
            <div className="figureShowcase">
                <h2> Painted Minifigures </h2>
                <p> I also paint some minifigures, I actually got a 3d printer just to have things to paint for cheap. I have an instagram <a style={{padding:0,margin:0}} href="https://www.instagram.com/tillosfigures/">@tillosfigure/</a> to help showcase the figures ive printed, and painted! Here are some favourites: </p>
            </div>
            <div className="rakshaShowcase">
                <h2>Art Showcase</h2>
                <p> My girlfriend makes incredible art, heres a showcase of some of the things </p>
                <p> test</p>
            </div>
            </div>
            )
    }
}
    
