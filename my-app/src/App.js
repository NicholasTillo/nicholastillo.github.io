

import './App.css';

import { HashRouter, Routes, Route } from 'react-router-dom';

import Homepage from './Pages/homepage';
import Images from './Pages/images';
import Page2 from './Pages/page2';
import Page3 from './Pages/page3';

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
          <Route path = "/images" element = {<Images/>} />
          <Route path = "/page2" element = {<Page2/>} />
          <Route path = "/page3" element = {<Page3/>} />
        </Route>
        
        

      </Routes>
    </HashRouter>

  );
}

export default App;
