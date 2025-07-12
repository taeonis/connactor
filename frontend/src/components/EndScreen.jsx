import { useGame } from '../context/GameContext';
import { useState, forwardRef, useRef, useEffect } from 'react';
import * as animations from "../utils/animations";

const EndScreen =  forwardRef(({ show, toggleGameOverPopup, hintCache }, ref) => { 
    const { nodes } = useGame();
    const trophyRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const finalScore = `🎥x${Math.ceil(nodes.length / 2)} 🫂x${Math.floor(nodes.length / 2)} 💡x${Object.keys(hintCache).length}`;

    useEffect(() => {
        if (show && show != 'closing') {
            animations.openPopup(ref);
            animations.trophyJump(trophyRef.current);
        } else if (show == 'closing') {
            animations.closePopup(ref);
        }
    }, [show]);

    const handleCopy = () => {
        navigator.clipboard.writeText(`Connactor #0: ${finalScore}`).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }

    return (
        <div id="gameover-overlay" className='popup-overlay' onClick={toggleGameOverPopup}>
            <div ref={ref} className='popup gameover' onClick={e => e.stopPropagation()}>
                {/* <img className='close-popup-icon' src='/delete.png' onClick={toggleGameOverPopup} /> */}
                <img ref={trophyRef} className='trophy' src='/trophy.png' />
                <div className='popup-text'>
                    <h2>Congrats!</h2>
                    <hr />
                    <p>You solved today's Connactor in: </p>
                    <p className='final-score'><b>{finalScore}</b></p>
                </div>
                <button className={`share-button ${!copied ? '' : 'copied'}`} onClick={handleCopy}> {!copied ? 'Share' : 'Copied!'} </button>
                <div className='popup-text'>
                    <hr />
                    <hr />
                    <p>The shortest possible connection was: PLACEHOLDER</p> 
                </div>
            </div>
        </div>
    )
});

export default EndScreen;