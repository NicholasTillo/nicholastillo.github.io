import React from "react";
import { Link } from "react-router";
import Gallery from "react-photo-gallery"
import { photos2 } from "./photos.js";




export default class PhotoGallery extends React.Component {
  render() {
    

    return (
      <div className="PhotoGallery">
        <Gallery photos={photos2} direction="row" margin="3px" />
      </div>
    );
  }
}

