import React from "react";
import './Song.css';


export default class Song extends React.Component {
  render() {
    return (
      <div className="songDiv">
            <p>This is a song!! i promise</p>
            <p>this is the artist name</p>
      </div>
    );
  }
}