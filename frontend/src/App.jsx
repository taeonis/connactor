import { useState, useRef, useEffect } from 'react'
import './App.css'
import NodeManager from './components/NodeManager';
import HintManager from './components/HintManager.jsx';

function App() {
    const [nodes, setNodes] = useState([ { id: 1, data: null} ]);
    const [gameOver, setGameOver] = useState(false);
    const [showGameOverPopup, setShowGameOverPopup] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);

    const[showHintsFor, setShowHintsFor] = useState(null);
    const cache = useRef({'people': {}, 'movies': {}})

    function toggleGameOverPopup() {
        setShowGameOverPopup(prev => !prev);
    }

    function toggleHint(node) {
        console.log("show hints for: ", node);
        setShowHintsFor(prev => (prev === node ? null : node));
    }

    function toggleInstructions() {
        setShowInstructions(prev => !prev);
    }

    return (
        <div className='App'>
            <img src='/connactor_logo.png' className='logo-img'/>

            <br/><button onClick={toggleInstructions}>How to play?</button>
            {showInstructions && (
                <div id='instructionsOverlay' class='overlay'>
                    <div class='instructionsPopup'>
                        <h2>How to play?</h2>
                        <p>Instructions here</p>
                    </div>
                </div>
            )}
            
            <div className='game-container'>
                <NodeManager 
                    nodes={nodes}
                    setNodes={setNodes}
                    gameOver={gameOver}
                    setGameOver={setGameOver}
                    cache={cache.current}
                    toggleHint={toggleHint}
                />
            </div>

            <hr class='rounded'/>

            {showHintsFor !== null && (
                <HintManager
                    node={showHintsFor}
                    cache={cache.current}
                    toggleHint={toggleHint}
                />
            )}
            
            {gameOver && showGameOverPopup && (
                <div id="gameOverOverlay" class="overlay">
                    <div class="gameOverPopup">
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
