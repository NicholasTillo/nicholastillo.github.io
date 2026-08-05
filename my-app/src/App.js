

import './App.css';

import { HashRouter, Routes, Route } from 'react-router-dom';

import Homepage from './Pages/homepage';
import About from './Pages/about';
import Projects from './Pages/projects';
import Page3 from './Pages/page3';
import LightingDemos from './Pages/lightingdemos';
import Mugi from './Pages/mugi';
import DeckChecker from './Pages/deckchecker';
import Gdd from './Pages/gdd';


import { Layout } from './Layout';

function App() {
  return (
    //Single Router Object 
    <HashRouter>
      {/*A single container*/} 
      <Routes>
        {/* In order to make the header outside of the pages, we use this layout as a parent to all the other pages  */}
        <Route element={<Layout/>}>
          {/*Each route with their corresponding page elemnts */} 
          <Route path = "/" element = {<Homepage/>} />
          <Route path = "/about" element = {<About/>} />
          <Route path = "/projects" element = {<Projects/>} />
          <Route path = "/page3" element = {<Page3/>} />
          <Route path = "/lightingdemos" element = {<LightingDemos/>} />
          <Route path = "/mugi" element = {<Mugi/>} />
          <Route path = "/deckchecker" element = {<DeckChecker/>} />
          <Route path = "/gdd" element = {<Gdd/>} />

        </Route>
        
        

      </Routes>
    </HashRouter>

  );
}

export default App;
