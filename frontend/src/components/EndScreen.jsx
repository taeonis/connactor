import { useGame } from '../context/GameContext';
import { useState, forwardRef, useRef, useEffect } from 'react';
import * as animations from "../utils/animations";
import { getDate } from '../utils/dateUtils';

const EndScreen =  forwardRef(({ show, toggleGameOverPopup, hintCache }, ref) => { 
    const { nodes, startingPerson, endingPerson, currentGameNum } = useGame();
    const trophyRef = useRef(null);
    const [scoreCopied, setScoreCopied] = useState(false);
    const [connectionCopied, setConnectionCopied] = useState(false);
    const finalScore = `🎥x${Math.ceil(nodes.length / 2)} 🫂x${Math.floor(nodes.length / 2)} 💡x${Object.keys(hintCache).length}`;

    useEffect(() => {
        if (show && show != 'closing') {
            animations.openPopup(ref);
            animations.trophyJump(trophyRef.current);
        } else if (show == 'closing') {
            animations.closePopup(ref);
        }
    }, [show]);

    const shareScore = () => {
        navigator.clipboard.writeText(`Connactor #${currentGameNum}: ${finalScore}`).then(() => {
            setScoreCopied(true);
            setTimeout(() => setScoreCopied(false), 1500);
        });
    }
    const shareConnection = () => {
        const names = [
            startingPerson.data.name,
            ...nodes.map(node => node.data.name || node.data.title),
            endingPerson.data.name
        ];
        
        const connectionStr = `Connactor #${currentGameNum}: ${names.join(' ⇒ ')}`;
        navigator.clipboard.writeText(connectionStr).then(() => {
            setConnectionCopied(true);
            setTimeout(() => setConnectionCopied(false), 1500);
        })
    }

    const isTodaysGame = () => {
        const today = new Date().toISOString().split('T')[0];
        return getDate(currentGameNum) == today;
    }

    return (
        <div id="gameover-overlay" className='popup-overlay' onClick={toggleGameOverPopup}>
            <div ref={ref} className='popup gameover' onClick={e => e.stopPropagation()}>
                <img className='close-popup-icon' src='/delete.png' onClick={toggleGameOverPopup} />
                <img ref={trophyRef} className='trophy' src='/trophy.png' />
                <div className='popup-text'>
                    <h2>Congrats!</h2>
                    <hr />
                    { isTodaysGame() ? 
                        <p>You solved today's Connactor in: </p>
                        :
                        <p>You solved Connactor #{currentGameNum} in: </p>
                    }
                    <p className='final-score'><b>{finalScore}</b></p>
                    {Object.keys(hintCache).length == 0 && (
                        <p>(Wow, no hints!)</p>
                    )}
                </div>
                <button className={`share-button ${!scoreCopied ? '' : 'copied'}`} onClick={shareScore}> {!scoreCopied ? 'Share Score' : 'Copied!'} </button>
                <button className={`share-button ${!connectionCopied ? '' : 'copied'}`} onClick={shareConnection}> {!connectionCopied ? 'Share Connection' : 'Copied!'} </button>
                <div className='popup-text'>
                    <hr />
                    <hr />
                </div>
            </div>
        </div>
    )
});

export default EndScreen;