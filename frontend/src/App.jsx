import { useState, useRef, useEffect } from 'react'
import './App.css'
import { useGame, GameProvider } from './context/GameContext';
import NodeManager from './components/NodeManager';
import HintManager from './components/HintManager.jsx';
import Instructions from './components/Instructions.jsx';
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
