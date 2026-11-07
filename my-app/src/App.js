

import './App.css';

import { HashRouter, Routes, Route } from 'react-router-dom';

import Homepage from './Pages/homepage';
import Projects from './Pages/projects';
import ProjectDetail from './Pages/projectdetail';
import Page3 from './Pages/page3';
import Assets from './Pages/assets';
import Mugi from './Pages/mugi';
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
          <Route path = "/projects" element = {<Projects/>} />
          <Route path = "/projects/:slug" element = {<ProjectDetail/>} />
          <Route path = "/page3" element = {<Page3/>} />
          <Route path = "/assets" element = {<Assets/>} />
          <Route path = "/mugi" element = {<Mugi/>} />
          <Route path = "/gdd" element = {<Gdd/>} />

        </Route>
        
        

      </Routes>
    </HashRouter>

  );
}

export default App;
