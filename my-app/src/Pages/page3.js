import React from "react";
import './basepages.css'
import './page3.css'
import FUBnyu from "../Assets/FUBnyu.jpg"
import { Link } from "react-router-dom";
import rotomTamagatchiCode from "../data/rotomTamagatchiCode";
import RotomScreen from "../components/RotomScreen";

export default class Page3 extends React.Component {

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

    render(){
        return(
            <div className="mainBody">
            
            
            <h2 className="PageTitle"> Creative Works</h2>

            <div className="gamingShowcase">
           <h2>Gaming Showcase</h2> 

            <h3> Binding Of Issac </h3>
            <p> Bunny Resprite for The Binding Of Issac </p>
            <p> Currently on the steam community page for The Binding Of Issac, just a simple retexture for the troll bombs to be bunnies instead! This is my first dips into Issac modding and want to do much more in the future.</p>

            <Link id="BunnyImage" smooth to="https://steamcommunity.com/sharedfiles/filedetails/?id=3537671862">
                      <img src={FUBnyu} alt="Bunny resprite for The Binding of Isaac" />
                    </Link>
            </div>

            <div className="seperator"> </div>
            <div className="rotomShowcase">
                <h2> Rotom Tamagatchi Project </h2>
                <p> I made a rotom inspired Tamagatchi using a Arduino Nano, and a mini screen.</p>
                 <a className="OuterLink" href="https://github.com/NicholasTillo/rotomArduinoProjectTamagatchi/tree/main">GitHub Link</a>
                <div className="campaignGallery">
                    {[1,2,3].map((i) => (
                        <div key={i} className="campaign-slot">
                            <img src={require(`../Assets/Rotom${i}.jpg`)} alt={`Rotom ${i}`} onClick={() => this.openLightbox(require(`../Assets/Rotom${i}.jpg`))} />
                        </div>
                    ))}
                </div>
                <p className="rotomCodeLabel">The Arduino sketch that runs it:</p>
                <pre className="rotomCode"><code>{rotomTamagatchiCode}</code></pre>
                <p className="rotomCodeLabel">And here's what it draws on the little OLED screen:</p>
                <RotomScreen/>
            </div>
            <div className="seperator"> </div>

            <div className="HKMTGShowcase">
                <h2> Hollow Knight MTG Set</h2>
                <p> Implementing a custom Hollow Knight MTG set for use in cockatrice and draftmancer.   </p>
                <a className="OuterLink" href="https://github.com/NicholasTillo/HK-MTG-Set">GitHub Link</a>
                
                <div className="hkmtgGallery">
                    {[1,2,3,4].map((i) => (
                        <div key={i} className="hkmtg-slot">
                            <img src={require(`../Assets/HKMTG${i}.jpg`)} alt={`HKMTG ${i}`} />
                        </div>
                    ))}
                </div>

            </div>
            <div className="seperator"> </div>

            <div className="figureShowcase">
                <h2> Painted Minifigures </h2>
                <p> I also paint some minifigures, I actually got a 3d printer just to have things to paint for cheap. I have an instagram <a style={{padding:0,margin:0}} href="https://www.instagram.com/tillosfigures/">@tillosfigure/</a> to help showcase the figures ive printed, and painted! Here are some favourites: </p>
            </div>
            <div className="seperator"> </div>

            
            <div className="dndShowcase">
                <h2>Dungeons And Dragons, Custom Campaigns</h2>

                <div className="campaignSection">
                    <h3>Prolea</h3>
                    <p> Prolea is my Faerun inspired fully homebrew DnD campaign, I have played 3 different campaigns in this setting, based around the dragon diety Tiamat, and the primal ancient chromatic dragons, sealed away by ancient wizards. A chaotic battle for power ensues as relics of the dragons begin to resurface and promises of power are made. </p>
                    <div className="campaignGallery">
                        {[1,2,3].map((i) => (
                            <div key={i} className="campaign-slot">
                                <img src={require(`../Assets/Prolea${i}.jpg`)} alt={`Prolea ${i}`} onClick={() => this.openLightbox(require(`../Assets/Prolea${i}.jpg`))} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="campaignSection">
                    <h3>Spirex Flora</h3>
                    <p>The island of the Spirex Flora is a mystical place fueled by the magical flower the S. Flora. A flower with the strange power to amplify the effects of the methods of refinement. What used to be one united population is fracted into two distinct groups as the power of the flower is revealed. the seafaring and openmindied group known as the Wanban inhabit the exterior of the spiral, and the spiritual and traditionial waabigaanbe inhabit the magically charged center.</p>
                    <p> Full One-Shot:<a href="/spirex-one-shot.pdf" target="_blank" rel="noopener noreferrer">Link</a></p>
                    <div className="campaignGallery">
                        {[1,2,3].map((i) => (
                            <div key={i} className="campaign-slot">
                                <img src={require(`../Assets/Spirex${i}.jpg`)} alt={`Spirex${i}`} onClick={() => this.openLightbox(require(`../Assets/Spirex${i}.jpg`))} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="seperator"> </div>

            
            <div className="rakshaShowcase">
                <h2>Art Showcase</h2>
                <p> My girlfriend makes incredible art, heres a showcase of some of the things that she does <a style={{padding:0,margin:0}} href="https://www.instagram.com/r4ksha/">@r4ksha/</a>. </p>

            </div>

            {this.state.activeSrc && (
                <div className="lightboxOverlay" onClick={this.closeLightbox}>
                    <img src={this.state.activeSrc} className="lightboxImage" alt="enlarged" onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            </div>
            )
    }
}
    
