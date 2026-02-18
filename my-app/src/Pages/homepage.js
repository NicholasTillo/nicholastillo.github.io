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

import FightSelected from '../Assets/Fight_Selected.png'
import MercySelected from '../Assets/Mercy_Selected.png'
import ActSelected from '../Assets/Act_Selected.png'
import ItemSelected from '../Assets/Item_Selected.png'

import "./homepage.css"



export default class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hovered: null };
    }

    setHovered = (name) => this.setState({ hovered: name });

    clearHovered = () => this.setState({ hovered: null });

    render() {
        return (
        <div className="App">
            <header className="App-header">
               
                <img src={mugi} className="App-logo" alt="logo" />
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
                    />
                    <img
                        src={this.state.hovered === 'Act' ? Act_Selected : Act}
                        alt="Act"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Act')}
                        onMouseLeave={this.clearHovered}
                    />
                    <img
                        src={this.state.hovered === 'Item' ? Item_Selected : Item}
                        alt="Item"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Item')}
                        onMouseLeave={this.clearHovered}
                    />
                    <img
                        src={this.state.hovered === 'Mercy' ? Mercy_Selected : Mercy}
                        alt="Mercy"
                        role="button"
                        tabIndex={0}
                        onMouseEnter={() => this.setHovered('Mercy')}
                        onMouseLeave={this.clearHovered}
                    />

                </div>
                

                
            </header>
            </div>
    );

    }
}
