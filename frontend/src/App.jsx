import './App.css'
import { GameProvider } from './context/GameContext';
import GameContainer from './components/GameContainer'

function App() {
    
    return (
        <GameProvider>
            <div className='App'>
                <GameContainer/ >
            </div>
        </GameProvider>
    )
}

export default App
