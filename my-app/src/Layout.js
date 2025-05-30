import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { Outlet } from "react-router";

export function Layout(){
    return (
        <>
            <NavBar/>
            
            <main>
                <Outlet/>
            </main>

            <Footer/>
        </>
    );
}