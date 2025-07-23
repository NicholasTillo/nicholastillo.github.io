import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { photos2 } from "./photos";
import "./Gallery.css"



export default class PhotoGallery extends React.Component {
  
  render() {
    const images = [];
    var photo2copy = photos2.slice();

    var i = 0;
    var j = 0;
    while (photo2copy.length > 1) {
      var index = Math.floor(Math.random() * photo2copy.length)
      var curphoto = photo2copy[index];
      images.push(
        <Link smooth to={"#"+curphoto.link} 
        style={
          {gridRow: (curphoto.width > 1) ? (i + 1) / curphoto.width : i + 1 , 
            gridColumn:(curphoto.height > 1) ? i + (1 / curphoto.height) : i + 1}}>
          <img src={curphoto.src} />
        </Link>
      );
      i+= 1;
      j+= 1;
      photo2copy.splice(index,1)

    }

    return (
      <div className="PhotoGallery">
          {images}
      </div>
    );
  }
}

