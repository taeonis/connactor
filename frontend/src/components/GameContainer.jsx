import { useState, useRef, useEffect } from 'react'
import { useGame } from '../context/GameContext';
import NodeManager from './NodeManager';
import HintManager from './HintManager';
import InstructionsPopup from './Instructions';
import EndScreen from './EndScreen';
import './GameContainer.css';
import { CSSTransition } from 'react-transition-group';
import * as animations from "../utils/animations";
import gsap from 'gsap';

const GameContainer = () => {
    const { gameOver, startingPerson, setStartingPerson, endingPerson, setEndingPerson, showHintsFor} = useGame();
    const hintManagerRef = useRef(null);
    const instructionsRef = useRef(null);
    const endScreenRef = useRef(null);
    const [showGameOverPopup, setShowGameOverPopup] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [hintCache, setHintCache] = useState({}); // format: { ID: type }

    const toggleGameOverPopup = () => {
        if (showGameOverPopup) {
            setShowGameOverPopup('closing');
            setTimeout(() => setShowGameOverPopup(false), 250);
        }
        else {
            setShowGameOverPopup(true);
        }
    }

    const toggleInstructions = () => {
        if (showInstructions) {
            setShowInstructions('closing');
            setTimeout(() => setShowInstructions(false), 250);
        }
        else {
            setShowInstructions(true);
        }
    }
    
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

    const testMinPath = async () => {
        console.log('calculating...');
        const response = await fetch(`/api/min-path?start_id=${startingPerson.data.id}&end_id=${endingPerson.data.id}`);
        const json = await response.json();
        console.log('min path: ', json);
    }


    useEffect(() => { // scroll lock controller
        if (showGameOverPopup || showInstructions) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = '';  
        }
    }, [showGameOverPopup, showInstructions]);

    return (
        <><div className='game-container'>
            <img src='/connactor_logo.png' className='logo-img'/>

            
            <div className='game-info-bar'>
                <div className='game-info left'>
                    <img className='instructions-icon' src='/question.png' onClick={toggleInstructions}/>
                    <img className='archive-icon' src='/archive.png' onClick={() => testMinPath()}/>
                </div>
                <div className='game-info right'>
                    {!gameOver ? (
                        <img className='swap-icon' src='/swap.png' onClick={swapStartAndEnd}/>
                    ) : (
                        <img className='swap-icon' src='/share.png' onClick={toggleGameOverPopup}/>
                    )}
                    <b className='hint-counter'>💡x{Object.keys(hintCache).length}</b>
                </div>
            </div>

            {showInstructions && (
                <InstructionsPopup
                    ref={instructionsRef}
                    show={showInstructions}
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

        {showGameOverPopup && (
            <EndScreen 
                ref={endScreenRef}
                show={showGameOverPopup}
                toggleGameOverPopup={toggleGameOverPopup}
                hintCache={hintCache}
            />
        )}

        </>
    )
}

export default GameContainer;
