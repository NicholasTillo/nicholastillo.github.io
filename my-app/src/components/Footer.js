import React from "react";
import "./Footer.css"


export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 'real' };
  }

  setTab = (tab) => {
    this.setState({ activeTab: tab });
  }

  render() {
    const { activeTab } = this.state;
    return (
      <div className="wholeFooter">
        <div className="phoneFooter">
          <div className="footerTabs">
            <button type="button" className={activeTab === 'real' ? 'active' : ''} onClick={() => this.setTab('real')}>Real Links</button>
            <button type="button" className={activeTab === 'contact' ? 'active' : ''} onClick={() => this.setTab('contact')}>Contact Info</button>
            <button type="button" className={activeTab === 'stupid' ? 'active' : ''} onClick={() => this.setTab('stupid')}>Stupid Links</button>
          </div>
          <div className="footerPanel">
            {activeTab === 'real' && (
              <div className="panelSection">
                <h2>Real Links</h2>
                <div className="linkListLeft">
                  <a className="App-link" href="https://www.linkedin.com/in/nicholastillo/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <a className="App-link" href="https://nicholastillo.itch.io" target="_blank" rel="noopener noreferrer">Itch.io</a>
                </div>
              </div>
            )}
              {activeTab === 'contact' && (
                <div className="panelSection">
                  <h2>Contact Info</h2>
                  <p>Email: nicholastillo@gmail.com</p>
                </div>
              )}
              {activeTab === 'stupid' && (
                <div className="panelSection">
                  <h2>Stupid Links</h2>
                  <div className="linkListRight">
                    <a className="App-link" href="https://cubecobra.com/cube/overview/QBert" target="_blank" rel="noopener noreferrer">MTGCube</a>
                    <a className="App-link" href="https://backloggd.com/u/PukMen/" target="_blank" rel="noopener noreferrer">Backloggd</a>
                  </div>
                </div>
              )}
            </div>
        </div>

        <div className="useableFooter desktopFooter">
          <div className="leftFooter">
            <h2>Real Links</h2>
            <div className="linkListLeft">
              <a className="App-link" href="https://www.linkedin.com/in/nicholastillo/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className="App-link" href="https://nicholastillo.itch.io" target="_blank" rel="noopener noreferrer">Itch.io</a>
            </div>
          </div>

          <div className="verticalBar"></div>

          <div className="centerFooter">
            <h2>Contact Info</h2>
            <p>Email: nicholastillo@gmail.com</p>
          </div>

          <div className="verticalBar"></div>

          <div className="rightFooter">
            <h2>Stupid Links</h2>
            <div className="linkListRight">
              <a className="App-link" href="https://cubecobra.com/cube/overview/QBert" target="_blank" rel="noopener noreferrer">MTGCube</a>
              <a className="App-link" href="https://backloggd.com/u/PukMen/" target="_blank" rel="noopener noreferrer">Backloggd</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}