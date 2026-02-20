import React from "react";
import { HashLink as Link } from "react-router-hash-link";
import { photos2 } from "./photos";
import "./Gallery.css"



export default class PhotoGallery extends React.Component {
  constructor(props){
    super(props);
    this.state = { activeSrc: null };
    this.orderedPhotos = this.shuffleArray(photos2.slice());
  }

  shuffleArray(arr){
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  openLightbox = (src) => {
    this.setState({ activeSrc: src });
    // prevent background scrolling when open
    document.body.style.overflow = 'hidden';
  }

  closeLightbox = () => {
    this.setState({ activeSrc: null });
    document.body.style.overflow = '';
  }

  render() {
    const images = [];
    const photoList = this.orderedPhotos || this.shuffleArray(photos2.slice());
    for (let idx = 0; idx < photoList.length; idx++){
      let curphoto = photoList[idx];
      images.push(
        <Link
          key={curphoto.src + idx}
          smooth
          to={"#" + (curphoto.link || '')}
          onClick={(e) => { e.preventDefault(); this.openLightbox(curphoto.src); }}
          style={{
            gridColumn: `span ${curphoto.width || 1}`,
            gridRow: `span ${curphoto.height || 1}`,
            display: 'block'
          }}
        >
          <img src={curphoto.src} alt={curphoto.link || 'project image'} />
        </Link>
      );
    }

    return (
      <div>
        <div className="PhotoGallery">
            {images}
        </div>

        {this.state.activeSrc && (
          <div className="lightboxOverlay" onClick={this.closeLightbox}>
            <img
              src={this.state.activeSrc}
              className="lightboxImage"
              alt="enlarged project"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    );
  }
}

