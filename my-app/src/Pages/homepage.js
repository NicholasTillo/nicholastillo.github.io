import React from "react";

import mugi from './Assets/mugi.png'
import Header from './Header';
import Footer from './Footer';


export default class homepage extends React.Component {
    render() {
        return (
        <div className="App">
            <header className="App-header">
                <Header/>
                <img src={mugi} className="App-logo" alt="logo" />
                <p>
                This is Mugi, We like Mugi
                </p>
                
                <Footer/>
            </header>
            </div>
    );

    }
}
