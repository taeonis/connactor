import './App.css'
import { GameProvider } from './context/GameContext';
import GameContainer from './components/GameContainer'
import ArchivePage from './components/ArchivePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

const preloadImages = () => {
  const imageModules = import.meta.glob('/src/assets/images/*.{png,jpg,jpeg,svg}', { eager: true });

  Object.values(imageModules).forEach((mod) => {
    const img = new Image();
    img.src = mod.default;
  });
};

const App = () => {
    useEffect(() => {
        preloadImages();
    }, []);

    return (
        <Router>
            <GameProvider>
                <div className='App'>
                    <Routes>
                        <Route path='/' element={<GameContainer />} />
                        {/* <Route path='/archive' element={<ArchivePage />} /> */}
                    </Routes>
                </div>
            </GameProvider>
        </Router>
        
    )
}

export default App
