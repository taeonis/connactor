import { useState, useRef } from 'react'
import { useGame } from '../context/GameContext';
import NodeManager from './NodeManager';
import HintManager from './HintManager';
import Instructions from './Instructions';
import EndScreen from './EndScreen';
import './GameContainer.css';
import { CSSTransition } from 'react-transition-group';

const GameContainer = () => {
    const { gameOver, nodes, startingPerson, setStartingPerson, endingPerson, setEndingPerson, showHintsFor} = useGame();
    const hintManagerRef = useRef(null);
    const [showGameOverPopup, setShowGameOverPopup] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [hintCache, setHintCache] = useState({}); // format: { ID: type }

    const toggleGameOverPopup = () => setShowGameOverPopup(prev => !prev);
    const toggleInstructions = () => setShowInstructions(prev => !prev);
    
    const swapStartAndEnd = () => {
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

            <div className='game-info-bar'>
                <div className='game-info left'>
                    <img className='instructions-button' src='https://cdn-icons-png.flaticon.com/128/471/471664.png' onClick={toggleInstructions}/>
                    <button>Archive</button>
                </div>
                <div className='game-info right'>
                    {!gameOver ? (
                        <img className='swap-icon' src='https://cdn-icons-png.flaticon.com/128/3031/3031715.png' onClick={swapStartAndEnd}/>
                    ) : (
                        <img className='swap-icon' src='https://cdn-icons-png.flaticon.com/128/1358/1358023.png' onClick={toggleGameOverPopup}/>
                    )}
                    <b className='hint-counter'>💡x{Object.keys(hintCache).length}</b>
                </div>
            </div>
            {showInstructions && (
                <Instructions
                    toggleInstructions={toggleInstructions} 
                />
            )}
        
            <NodeManager 
                setShowGameOverPopup={setShowGameOverPopup}
            />

            <CSSTransition
                in={showHintsFor !== null}
                timeout={300}
                classNames="hint-manager-toggle"
                unmountOnExit
                nodeRef={hintManagerRef}
            >
                <HintManager
                    ref={hintManagerRef}
                    setHintCache={setHintCache}
                    hintCache={hintCache}
                />
            </CSSTransition>
        </div>
        
        {gameOver && showGameOverPopup && (
            <EndScreen 
                toggleGameOverPopup={toggleGameOverPopup}
                hintCache={hintCache}
            />
        )}</>
    )
}

export default GameContainer;
