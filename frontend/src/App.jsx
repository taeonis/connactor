import './App.css'
import { GameProvider } from './context/GameContext';
import GameContainer from './components/GameContainer'
import ArchivePage from './components/ArchivePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

/* <GameProvider>
            <div className='App'>
                <GameContainer/ >
            </div>
        </GameProvider>
        <a href="https://www.flaticon.com/free-icons/archive" title="archive icons">Archive icons created by gariebaldy - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/question" title="question icons">Question icons created by Roundicons - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/share" title="share icons">Share icons created by Freepik - Flaticon</a>
        </> */
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
                        <Route path='/archive' element={<ArchivePage />} />
                    </Routes>
                </div>
            </GameProvider>
        </Router>
        
    )
}

export default App
