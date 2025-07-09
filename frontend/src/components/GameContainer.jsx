import { useState, useEffect } from 'react'
import { useGame } from '../context/GameContext';
import NodeManager from './NodeManager';
import HintManager from './HintManager';
import Instructions from './Instructions';

function GameContainer() {
    const { gameOver, nodes, startingPerson, setStartingPerson, endingPerson, setEndingPerson, showHintsFor} = useGame();
    const [showGameOverPopup, setShowGameOverPopup] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [hintCache, setHintCache] = useState({}); // format: { ID: type }

    function toggleGameOverPopup() {
        setShowGameOverPopup(prev => !prev);
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
            
            <p>Hints used: {Object.keys(hintCache).length}</p>
        
            <NodeManager 
                setShowGameOverPopup={setShowGameOverPopup}
            />
            {showHintsFor !== null && (
                <HintManager
                    setHintCache={setHintCache}
                    hintCache={hintCache}
                />
            )}
        </div>
        
        {gameOver && showGameOverPopup && (
            <div id="gameOverOverlay" className="overlay" onClick={toggleGameOverPopup}>
                <div className="gameOverPopup">
                    <h2>Congrats!</h2>
                    <p>You solved today's Connactor in {Math.ceil(nodes.length / 2)} 🎥 {Math.floor(nodes.length / 2)} 🫂 {Object.keys(hintCache).length} 💡</p>
                    <p>The shortest possible connection was: PLACEHOLDER</p>
                    <button onClick={() => toggleGameOverPopup()}>Close</button>
                </div>
            </div>
        )}</>
    )
}

export default GameContainer;
