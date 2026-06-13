import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import GameOfLifeBackground from "./components/GameOfLifeBackground";
import { Outlet } from "react-router-dom";
import './layout.css'

export function Layout(){
    return (
        <div className="fullContainer">
            <GameOfLifeBackground />
            <NavBar/>
            
            <main>
                <Outlet/>
            </main>

            <Footer/>
        </div>
    );
}