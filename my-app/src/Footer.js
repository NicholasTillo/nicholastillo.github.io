import React from "react";


export default class Header extends React.Component {
  render() {
    return (
      <div className="component-app">
        <h2>
            <a  className="App-link"
                href="https://cubecobra.com/cube/overview/9b5e9c6c-fe9e-488a-8f01-fa1f07120beb"
                target="_blank"
                rel="noopener noreferrer">
                Link1

            </a>
            <a  className="App-link"
                href="https://backloggd.com/u/PukMen/"
                target="_blank"
                rel="noopener noreferrer">
                Link2

            </a>
        </h2>
      </div>
    );
  }
}