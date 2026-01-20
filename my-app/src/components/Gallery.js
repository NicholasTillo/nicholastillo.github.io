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
        <Link
          key={curphoto.src}
          smooth
          to={"#" + (curphoto.link || '')}
          style={{
            gridColumn: `span ${curphoto.width || 1}`,
            gridRow: `span ${curphoto.height || 1}`,
          }}
        >
          <img src={curphoto.src} alt={curphoto.link || 'project image'} />
        </Link>
      );
      if (i > 4){
        i = 0;
        j += 1;
      }
      else{
        i = i + 1;
      }
    
      photo2copy.splice(index,1)

    }

    return (
      <div className="PhotoGallery">
          {images}
      </div>
    );
  }
}

