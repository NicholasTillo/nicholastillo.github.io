import React from "react";
import { Link } from "react-router";
import './NavBar.css';


export default class NavBar extends React.Component {
  render() {
    return (
      <div className="NavBarDiv">
        <div className="wholeHeaderContent">
          <Link reloadDocument  to="/"  id="headerLink">
                <h1>
                Nicholas Tillo
                </h1>
            </Link>
          <div className="verticalBar"></div>
          <nav className="AccNavBar">
            <div className="navLeft">
              
                <Link reloadDocument  to="/about">
                  <button> About </button>
                </Link>
            </div>
            <div className="navMid">
                <Link reloadDocument to="/projects">
                  <button> Projects </button>
                </Link>
            </div>
            <div className="navRight">
                <Link reloadDocument to="/page3">
                  <button> Some Cool Stuff </button>
                </Link>
            </div>
          </nav>
          
        </div>
      </div>
    );
  }
}