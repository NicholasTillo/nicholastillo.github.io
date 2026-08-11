import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Leftbox from "./components/Leftbox";
import Rightbox from "./components/Rightbox";
import GameOfLifeBackground from "./components/GameOfLifeBackground";
import { Outlet } from "react-router-dom";
import './layout.css'

export function Layout(){
    return (
        <div className="fullContainer">
            <GameOfLifeBackground />
            <NavBar/>

            <div className="contentRow">
                <Leftbox/>
                <main>
                    <Outlet/>
                </main>
                <Rightbox/>
            </div>

            <Footer/>
        </div>
    );
}