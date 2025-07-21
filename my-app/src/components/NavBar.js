import React from "react";
import { Link } from "react-router";
import './NavBar.css';


export default class NavBar extends React.Component {
  render() {
    return (
      <div className="NavBarDiv">
          <Link to="/"  id="headerLink">
                <h1>
                Nicholas Tillo
                </h1>
            </Link>
        
        <nav className="AccNavBar">
          <div className="navLeft">
            
              <Link to="/about">
                <button> About </button>
              </Link>
          </div>
          <div className="navMid">
              <Link to="/projects">
                <button> Projects </button>
              </Link>
          </div>
          <div className="navRight">
              <Link to="/page3">
                <button> Some Cool Stuff </button>
              </Link>
          </div>
        </nav>
      </div>
    );
  }
}