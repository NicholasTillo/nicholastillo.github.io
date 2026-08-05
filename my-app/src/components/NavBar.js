import React from "react";
import { Link } from "react-router-dom";
import './NavBar.css';


export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.detailsRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (this.detailsRef.current && !this.detailsRef.current.contains(event.target)) {
      this.detailsRef.current.removeAttribute('open');
    }
  }

  closeMenu = () => {
    if (this.detailsRef.current) {
      this.detailsRef.current.removeAttribute('open');
    }
  }

  render() {
    return (
      <div className="NavBarDiv">
        <div className="wholeHeaderContent">
          <Link reloadDocument  to="/"  id="headerLink">
                <h1>
                Nicholas Tillo
                </h1>
            </Link>
          <div className="phoneMenu">
            <details ref={this.detailsRef}>
              <summary>Navigation</summary>
              <div className="phoneLinks">
                <Link reloadDocument to="/about" onClick={this.closeMenu}>About</Link>
                <Link reloadDocument to="/projects" onClick={this.closeMenu}>Projects</Link>
                <Link reloadDocument to="/page3" onClick={this.closeMenu}>Some Cool Stuff</Link>
                <Link reloadDocument to="/lightingdemos" onClick={this.closeMenu}>Lighting Demos</Link>
                <Link reloadDocument to="/mugi" onClick={this.closeMenu}>Mugi</Link>
                {/* ponytail: hidden until Deck Checker feature is complete — restore this link when done */}
                <Link reloadDocument to="/gdd" onClick={this.closeMenu}>Game Design Docs</Link>
              </div>
            </details>
          </div>
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
            <div className="navExtra">
                <Link reloadDocument to="/lightingdemos">
                  <button> Lighting Demos </button>
                </Link>
            </div>
            <div className="navExtra">
                <Link reloadDocument to="/mugi">
                  <button> Mugi </button>
                </Link>
            </div>
            {/* ponytail: hidden until Deck Checker feature is complete — restore this link when done */}
            <div className="navExtra">
                <Link reloadDocument to="/gdd">
                  <button> Game Design Docs </button>
                </Link>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}