import React from "react";
import './Song.css';
import OneBeer from '../Assets/OneBeer.jpg';
// import Song2Image from '../Assets/Song2.png';
// import Song3Image from '../Assets/Song3.png';
// import Song4Image from '../Assets/Song4.png';
// import Song5Image from '../Assets/Song5.png';


export default class Song extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSongIndex: 0,
      songs: [
        { title: "One Beer", artist: "MF DOOM - MM..FOOD", image: OneBeer },
        { title: "Song 2", artist: "Artist 2", image: null },
        { title: "Song 3", artist: "Artist 3", image: null },
        { title: "Song 4", artist: "Artist 4", image: null },
        { title: "Song 5", artist: "Artist 5", image: null }
      ]
    };
  }

  componentDidMount() {
    this.slideShowInterval = setInterval(() => {
      this.setState(prevState => ({
        currentSongIndex: (prevState.currentSongIndex + 1) % prevState.songs.length
      }));
    }, 5000); // Change song every 5 seconds
  }

  componentWillUnmount() {
    clearInterval(this.slideShowInterval);
  }

  goToNextSong = () => {
    this.setState(prevState => ({
      currentSongIndex: (prevState.currentSongIndex + 1) % prevState.songs.length
    }));
  }

  goToPrevSong = () => {
    this.setState(prevState => ({
      currentSongIndex: (prevState.currentSongIndex - 1 + prevState.songs.length) % prevState.songs.length
    }));
  }

  render() {
    const currentSong = this.state.songs[this.state.currentSongIndex];
    const progress = ((this.state.currentSongIndex + 1) / this.state.songs.length) * 100;

    return (
      <div className="songDiv">
        <div className="songSlideshow">
          <div className="songCard">
            <div className="albumArt">
              {currentSong.image && <img src={currentSong.image} alt={currentSong.title} />}
            </div>
            <div className="songContent">
              <h3 className="songTitle">{currentSong.title}</h3>
              <p className="artistName">{currentSong.artist}</p>
              <div className="songControls">
                <button onClick={this.goToPrevSong}>❮</button>
                <button onClick={this.goToNextSong}>❯</button>
              </div>
              <div className="progressBar">
                <div className="progress" style={{ width: progress + '%' }}></div>
              </div>
              <div className="songCounter">
                {this.state.currentSongIndex + 1} / {this.state.songs.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}