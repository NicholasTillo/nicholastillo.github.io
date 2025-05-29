import React from "react";


export default class Header extends React.Component {
  render() {
    return (
      <div className="component-app">
        <h1>
            Nicholas Tillo
        </h1>
        <nav>
          <div className="navLeft">
            <ul>
              <a href="/images">
                Page 1
              </a>
          </ul>
          </div>
          <div className="navMid">
            <ul>
              <a href="">
                Page 2
              </a>
          </ul>
          </div>
          <div className="navRight">
            <ul>
              <a href="">
                Page 3
              </a>
          </ul>
          </div>
        </nav>
      </div>
    );
  }
}