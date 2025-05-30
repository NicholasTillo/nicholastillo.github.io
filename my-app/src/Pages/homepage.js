import React from "react";

import mugi from '../Assets/mugi.png'


export default class Homepage extends React.Component {
    render() {
        return (
        <div className="App">
            <header className="App-header">
               
                <img src={mugi} className="App-logo" alt="logo" />
                <p>
                This is Mugi, We like Mugi
                </p>
                
                
            </header>
            </div>
    );

    }
}
