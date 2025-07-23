import React from "react";
import "./Footer.css"


export default class Footer extends React.Component {
  render() {
    return (
      <div className="wholeFooter">
        <div className="useableFooter">
          <div className="leftFooter">
            <p>
              Real Links
            </p>
              <div className="linkListLeft">
                <a  className="App-link"
                    href="https://www.linkedin.com/in/nicholastillo/"
                    target="_blank"
                    rel="noopener noreferrer">
                    Lnk

                </a>
                <a  className="App-link"
                    href="https://nicholastillo.itch.io"
                    target="_blank"
                    rel="noopener noreferrer">
                    Link2

                </a>
              </div>
          </div>
          <div className="centerFooter">
            Center Information
          </div>
          <div className="rightFooter">
              <p>
                Stupid Links
              </p>
              <div className="linkListRight">
                <a  className="App-link"
                    href="https://cubecobra.com/cube/overview/QBert"
                    target="_blank"
                    rel="noopener noreferrer">
                    MTGCube
                </a>
                <a  className="App-link"
                    href="https://backloggd.com/u/PukMen/"
                    target="_blank"
                    rel="noopener noreferrer">
                    Backloggd
                </a>
              </div>
            </div>
          </div>
      </div>
    );
  }
}