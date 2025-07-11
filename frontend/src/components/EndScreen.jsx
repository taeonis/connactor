import { useGame } from '../context/GameContext';

const EndScreen = ({ toggleGameOverPopup, hintCache }) => { 
    const { nodes } = useGame();
    return (
        <div id="gameover-overlay" className='popup-overlay' onClick={toggleGameOverPopup}>
            <div className='popup gameover' onClick={e => e.stopPropagation()}>
                <img className='close-instructions-icon' src='/delete.png' onClick={toggleGameOverPopup} />
                <div className='popup-text'>
                    <h2>Congrats!</h2>
                    <hr />
                    <p>You solved today's Connactor in: <br />
                        <b className='final-score'>🎥x{Math.ceil(nodes.length / 2)} 🫂x{Math.floor(nodes.length / 2)} 💡x{Object.keys(hintCache).length}</b>
                    </p>
                    <hr />
                    <p>The shortest possible connection was: PLACEHOLDER</p> 
                </div>
                <button>Share</button>
            </div>
        </div>
    )
};

export default EndScreen;