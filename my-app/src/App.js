

import './App.css';

import HashRouter from 'react-router-dom'; 
import Routes from 'react-router-dom'; 
import Route from 'react-router-dom'; 


import homepage from './Pages/homepage';
import images from './Pages/images';
import page2 from './Pages/page2';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path = "/" element = {homepage} />
      </Routes>
    </HashRouter>

  );
}

export default App;
