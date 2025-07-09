import { useState, useRef, useEffect } from 'react'
import { useGame } from '../context/GameContext';
import NodeManager from './NodeManager';
import HintManager from './HintManager';
import Instructions from './Instructions';

function GameContainer() {
    const { gameOver, setGameOver, nodes, setNodes, startingPerson, setStartingPerson, endingPerson, setEndingPerson, } = useGame();
    const [showGameOverPopup, setShowGameOverPopup] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [hintsEnabledFor, setHintsEnabledFor] = useState({});
    const [showHintsFor, setShowHintsFor] = useState(null);

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
        const tempData = startingPerson.data;
        const tempCredits = startingPerson.credits;
        setStartingPerson(prev => ({
            ...prev,
            data: endingPerson.data,
            credits: endingPerson.credits
        }));
        setEndingPerson(prev => ({
            ...prev,
            data: tempData,
            credits: tempCredits
        }))
    }

    return (
        <><div className='game-container'>
            <img src='/connactor_logo.png' className='logo-img'/>

            <br/><button onClick={toggleInstructions}>How to play?</button>
            {showInstructions && (
                <Instructions
                    toggleInstructions={toggleInstructions} 
                />
            )}
            {!gameOver && (
                <button onClick={swapStartAndEnd} >Swap Start and End</button>
            )}
            
            <p>Hints used: {Object.keys(hintsEnabledFor).length}</p>
        
            <NodeManager 
                toggleHint={toggleHint}
                setShowGameOverPopup={setShowGameOverPopup}
            />
            {showHintsFor !== null && (
                <HintManager
                    node={showHintsFor}
                    toggleHint={toggleHint}
                    setHintsEnabledFor={setHintsEnabledFor}
                    hintsEnabledFor={hintsEnabledFor}
                />
            )}
        </div>
        
        {gameOver && showGameOverPopup && (
            <div id="gameOverOverlay" className="overlay" onClick={toggleGameOverPopup}>
                <div className="gameOverPopup">
                    <h2>Congrats!</h2>
                    <p>You solved today's Connactor in {Math.ceil(nodes.length / 2)} 🎥 {Math.floor(nodes.length / 2)} 🫂 {Object.keys(hintsEnabledFor).length} 💡</p>
                    <p>The shortest possible connection was: PLACEHOLDER</p>
                    <p>You used {Object.keys(hintsEnabledFor).length} hints!</p>
                    <button onClick={() => toggleGameOverPopup()}>Close</button>
                </div>
            </div>
        )}
        </>
    )
}

export default GameContainer;
