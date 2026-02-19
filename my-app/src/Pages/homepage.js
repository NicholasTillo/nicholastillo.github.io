import React from "react";

import mugi from '../Assets/mugi.png'

import Fight from '../Assets/Fight.png'
import Mercy from '../Assets/Mercy.png'
import Act from '../Assets/Act.png'
import Item from '../Assets/Item.png'

import Fight_Selected from '../Assets/Fight_Selected.png'
import Mercy_Selected from '../Assets/Mercy_Selected.png'
import Act_Selected from '../Assets/Act_Selected.png'
import Item_Selected from '../Assets/Item_Selected.png'

import Slash from '../Assets/Slash.gif'

import "./homepage.css"



export default class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hovered: null, showSlash: false };
    }

    setHovered = (name) => this.setState({ hovered: name });

    clearHovered = () => this.setState({ hovered: null });

    fight = () => {
        this.setState({ showSlash: true });
        setTimeout(() => this.setState({ showSlash: false }), 1000);
    };
    act = () =>{
        console.log("Act button clicked");  
    };
    item = () =>{
        console.log("Item button clicked");
    };
    mercy = () =>{
        console.log("Mercy button clicked");
    };


    render() {
        return (
        <div className="App">
            <header className="App-header">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={mugi} className="App-logo" alt="logo" />
                    {this.state.showSlash && (
                        <img
                            src={Slash}
                            alt="slash"
                            className="slash-overlay"
                        />
                    )}
                </div>
            
                <p>
                This is Mugi, We like Mugi
                </p>

                <div className="ActionBar">
                    <img
                        src={this.state.hovered === 'Fight' ? Fight_Selected : Fight}
                        alt="Fight"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Fight')}
                        onMouseLeave={this.clearHovered}
                        onClick={this.fight}
                    />
                    <img
                        src={this.state.hovered === 'Act' ? Act_Selected : Act}
                        alt="Act"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Act')}
                        onMouseLeave={this.clearHovered}
                        onClick={this.act}

                    />
                    <img
                        src={this.state.hovered === 'Item' ? Item_Selected : Item}
                        alt="Item"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Item')}
                        onMouseLeave={this.clearHovered}
                        onClick={this.item}

                    />
                    <img
                        src={this.state.hovered === 'Mercy' ? Mercy_Selected : Mercy}
                        alt="Mercy"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Mercy')}
                        onMouseLeave={this.clearHovered}
                        onClick={this.mercy}

                    />

                </div>
                

                
            </header>
            </div>
    );

    }
}
