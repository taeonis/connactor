import './App.css'
import { GameProvider } from './context/GameContext';
import GameContainer from './components/GameContainer'
import ArchivePage from './components/ArchivePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* <GameProvider>
            <div className='App'>
                <GameContainer/ >
            </div>
        </GameProvider>
        <a href="https://www.flaticon.com/free-icons/archive" title="archive icons">Archive icons created by gariebaldy - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/question" title="question icons">Question icons created by Roundicons - Flaticon</a>
        <a href="https://www.flaticon.com/free-icons/share" title="share icons">Share icons created by Freepik - Flaticon</a>
        </> */

const App = () => {
    
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GameContainer />} />
                <Route path='/archive' element={<ArchivePage />} />
            </Routes>
        </Router>
        
    )
}

export default App
