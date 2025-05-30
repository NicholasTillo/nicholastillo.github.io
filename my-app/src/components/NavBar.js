import React from "react";
import { Link } from "react-router";


export default class NavBar extends React.Component {
  render() {
    return (
      <div className="NavBarDiv">
        <h1>
            Nicholas Tillo
        </h1>
        <nav>
          <div className="navLeft">
            <ul>
              <Link to="/images">
                <button> Page 1 </button>
              </Link>
          </ul>
          </div>
          <div className="navMid">
            <ul>
              <Link to="/page2">
                <button> Page 2 </button>
              </Link>
          </ul>
          </div>
          <div className="navRight">
            <ul>
              <Link to="/page3">
                <button> Page 3 </button>
              </Link>
          </ul>
          </div>
        </nav>
      </div>
    );
  }
}