import { useState, useRef, useEffect } from 'react'
import './App.css'
import NodeManager from './components/NodeManager';
import HintManager from './components/HintManager.jsx';
import Instructions from './components/Instructions.jsx';

function App() {
    const [nodes, setNodes] = useState([ { id: 1, data: null} ]);
    const [startingPerson, setStartingPerson] = useState({id: 0, data: ''});
    const [endingPerson, setEndingPerson] = useState({id: 12, data: ''});
    const [gameOver, setGameOver] = useState(false);
    const [showGameOverPopup, setShowGameOverPopup] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);

    const[showHintsFor, setShowHintsFor] = useState(null);
    const cache = useRef({'people': {}, 'movies': {}})

    function toggleGameOverPopup() {
        setShowGameOverPopup(prev => !prev);
    }

    function toggleHint(node) {
        setShowHintsFor(prev => (prev === node ? null : node));
    }

    function toggleInstructions() {
        setShowInstructions(prev => !prev);
    }

    function swapStartAndEnd() {
        const temp = startingPerson.data;
        setStartingPerson(prev => ({
            ...prev,
            data: endingPerson.data
        }));
        setEndingPerson(prev => ({
            ...prev,
            data: temp
        }))
    }

    return (
        <div className='App'>
            <div className='game-container'>
                <img src='/connactor_logo.png' className='logo-img'/>

                <br/><button onClick={toggleInstructions}>How to play?</button>
                {showInstructions && (
                    <Instructions
                        toggleInstructions={toggleInstructions} 
                    />
                )}
                <button onClick={swapStartAndEnd} >Swap Start and End</button>
            
                <NodeManager 
                    nodeProps={{ nodes, setNodes}}
                    gameOverProps={{ gameOver, setGameOver}}
                    startingProps={{ startingPerson, setStartingPerson }}
                    endingProps={{ endingPerson, setEndingPerson }}
                    cache={cache.current}
                    toggleHint={toggleHint}
                />
                {showHintsFor !== null && (
                    <HintManager
                        node={showHintsFor}
                        cache={cache.current}
                        toggleHint={toggleHint}
                    />
                )}
            </div>
            
            {gameOver && showGameOverPopup && (
                <div id="gameOverOverlay" className="overlay" onClick={toggleGameOverPopup}>
                    <div className="gameOverPopup">
                        <h2>Game Over!</h2>
                        <p>Congrats! You solved the connection in {Math.ceil(nodes.length / 2)} jumps!</p>
                        <p>The shortest possible connection was: PLACEHOLDER</p>
                        <button onClick={toggleGameOverPopup}>Close</button>
                    </div>
                </div>
            )}

        </div>
    )
}

export default App
