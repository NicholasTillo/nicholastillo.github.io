import mugi from './Assets/mugi.png'
import './App.css';
import Header from './Header';
import Footer from './Footer';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header/>
        <img src={mugi} className="App-logo" alt="logo" />
        <p>
          This is Mugi, We like Mugi
        </p>
        
        <Footer/>
      </header>
    </div>
  );
}

export default App;
