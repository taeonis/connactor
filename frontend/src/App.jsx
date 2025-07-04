import { useState, useRef } from 'react'
import './App.css'
import NodeManager from './components/NodeManager';

function App() {
    const [gameOver, setGameOver] = useState(false);
    const [nodes, setNodes] = useState([ { id: 1, data: null} ]);
    const [showGameOverPopup, setShowGameOverPopup] = useState(true);
    const cached_filmographies = useRef({});

    function toggleGameOverPopup() {
        setShowGameOverPopup(prev => !prev);
    }

    return (
        <div className='App'>
                {/* <big>
            MY GAME<br />
            how to play?
            </big>
            <br /><br /><br /> */}
            <div className='game-container'>
            <NodeManager 
                nodes={nodes}
                setNodes={setNodes}
                gameOver={gameOver}
                setGameOver={setGameOver}
            />
            </div>

            <hr class='rounded'/>

            {/* <HintManager></HintManager> */}

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
