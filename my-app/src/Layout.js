import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Outlet } from "react-router";
import './layout.css'

export function Layout(){
    return (
        <div className="fullContainer">
            <NavBar/>
            
            <main>
                <Outlet/>
            </main>

            <Footer/>
        </div>
    );
}