import React from "react";
import Song from "../components/Song.js";

import './basepages.css'
import "./homepage.css"

import Minecraft from '../Assets/Minecraft.jpg';
import Undertale from '../Assets/Undertale.jpg';
import Wilds from '../Assets/Wilds.jpg';
import Ultrakill from '../Assets/Ultrakill.jpg';
import Issac from '../Assets/Issac.jpg';
import White from '../Assets/White.jpg';
import Inscryption from '../Assets/Inscryption.jpg';
import Knight from '../Assets/Knight.jpg';
import League from '../Assets/leagueoflegends.jpg';
import PokemonInsurgence from '../Assets/insurgence5.jpg';
import SlayTheSpire2 from '../Assets/slaythespire2.jpg';
import Kirby from '../Assets/kirbye.jpg';
import Portal2 from '../Assets/portal2.jpg';
import Starfy from '../Assets/starfy.jpg';

export default class Homepage extends React.Component {
    render() {
        return (
            <div className="mainBody">
                <div className="homeIntro">
                    <h1 className="PageTitle">Welcome!</h1>
                    <p>This is a place where I share my projects and some cool stuff. Feel free to explore and check out the different sections using the navigation bar above.</p>
                </div>

                <p className="bioSection">
                    Hey There! Im Nicholas Tillo, I'm an aspiring game designer and programmer. I want my future to be filled with creative endeavors and my ultimate dream is to fully produce a video game from start to finish that gets published onto steam.
                    I was born to cultivate experiences for people, I've been drawn to creating moments that change and effect peoples lives, originally through Dungeons and Dragons, but now through game design. I am based in Toronto Canada so if you are around, get in touch!
                </p>

                <div className="musicSection">
                    <h2> Favourite Songs Right Now </h2>
                    <Song/>
                </div>

                <div className="gameSection">
                    <h2> My Favourite Games Of All Time </h2>
                    <div className="gameGrid">
                        {
                            [Minecraft, Undertale, Wilds, Ultrakill, Issac, White, Inscryption, Knight, League, PokemonInsurgence, SlayTheSpire2, Kirby, Portal2, Starfy].map((img, idx) => (
                                <div className="gameCard" key={idx}>
                                    <img src={img} alt={`game-${idx}`} />
                                </div>
                            ))
                        }
                    </div>
                </div>

            </div>
        );
    }
}
