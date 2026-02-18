import React from "react";
import "./Footer.css"


export default class Footer extends React.Component {
  render() {
    return (
      <div className="wholeFooter">
        <div className="useableFooter">
          <div className="leftFooter">
            <h2>
              Real Links
            </h2>
              <div className="linkListLeft">
                <a  className="App-link"
                    href="https://www.linkedin.com/in/nicholastillo/"
                    target="_blank"
                    rel="noopener noreferrer">
                    LinkedIn
                </a>
                
                <a  className="App-link"
                    href="https://nicholastillo.itch.io"
                    target="_blank"
                    rel="noopener noreferrer">
                    Itch.io

                </a>
              </div>
          </div>

          <div className="verticalBar"></div> 

          <div className="centerFooter">
            <h2> Contact Info </h2>
            <p> Email: nicholastillo@gmail.com </p>
          </div>

          <div className="verticalBar"></div>


          <div className="rightFooter">
              <h2>
                Stupid Links
              </h2>
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