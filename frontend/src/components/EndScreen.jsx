import { useGame } from '../context/GameContext';
import { useState, forwardRef, useRef, useEffect } from 'react';
import * as animations from "../utils/animations";

const EndScreen =  forwardRef(({ show, toggleGameOverPopup, hintCache }, ref) => { 
    const { nodes, startingPerson, endingPerson } = useGame();
    const trophyRef = useRef(null);
    const [scoreCopied, setScoreCopied] = useState(false);
    const [connectionCopied, setConnectionCopied] = useState(false);
    const finalScore = `🎥x${Math.ceil(nodes.length / 2)} 🫂x${Math.floor(nodes.length / 2)} 💡x${Object.keys(hintCache).length}`;

    const startDate = new Date('2025-07-13'); // YYYY-MM-DD
    const today = new Date();
    const diffTime = today - startDate;
    const connactorNum = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    useEffect(() => {
        if (show && show != 'closing') {
            animations.openPopup(ref);
            animations.trophyJump(trophyRef.current);
        } else if (show == 'closing') {
            animations.closePopup(ref);
        }
    }, [show]);

    const shareScore = () => {
        navigator.clipboard.writeText(`Connactor #${connactorNum}: ${finalScore}`).then(() => {
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
        
        const connectionStr = `Connactor #${connactorNum}: ${names.join(' ⇒ ')}`;
        navigator.clipboard.writeText(connectionStr).then(() => {
            setConnectionCopied(true);
            setTimeout(() => setConnectionCopied(false), 1500);
        })
    }

    return (
        <div id="gameover-overlay" className='popup-overlay' onClick={toggleGameOverPopup}>
            <div ref={ref} className='popup gameover' onClick={e => e.stopPropagation()}>
                <img className='close-popup-icon' src='/delete.png' onClick={toggleGameOverPopup} />
                <img ref={trophyRef} className='trophy' src='/trophy.png' />
                <div className='popup-text'>
                    <h2>Congrats!</h2>
                    <hr />
                    <p>You solved today's Connactor in: </p>
                    <p className='final-score'><b>{finalScore}</b></p>
                    {Object.keys(hintCache).length == 0 && (
                        <p>(Wow, no hints)</p>
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