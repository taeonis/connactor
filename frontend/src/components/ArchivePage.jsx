import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import './ArchivePage.css'
import { getDate } from '../utils/dateUtils';

const ArchivePage = () => {
    const navigate = useNavigate();
    const { restartGame, totalNumPairs, currentGameNum, setCurrentGameNum, setGamePair } = useGame();
    const connactorNums = Array.from({ length: totalNumPairs }, (_, i) => totalNumPairs - 1 - i); // numbered from today's connactor to 1

    const goHome = () => {
        navigate('/');
    };
    
    const clickLink = async (gameNum) => {
        if (currentGameNum != gameNum) {
            const date = getDate(gameNum);
            console.log(`trying to get pair for ${date}, gamenum=${gameNum}`);
            try {
                const response = await fetch(`/db/get-pair?date=${date}`);
                const newPair = await response.json();

                setGamePair(newPair);           
            } catch (e) {
                console.log(`Error failed to get pair for ${date}: ${e}`);
            }
            setCurrentGameNum(gameNum);
            console.log('changed ConnactorNum', currentGameNum);
        }
        restartGame();
        goHome();
    };

    return (
        <div className='archive'>  
            <div className='game-container'>
                <div className='archive-top'> 
                    <h1 className='archive-title'>ARCHIVE</h1>
                    <button className='back-button' onClick={goHome}>↩</button> 
                </div>  
                <hr />
                <div className='tile-grid'>
                    {connactorNums.map(gameNum => {
                        const isCurrent = gameNum === currentGameNum;
                        return (
                            <button
                                key={gameNum}
                                className={`tile${isCurrent ? ' current' : ''}`}
                                onClick={() => clickLink(gameNum)}
                            >
                                <p className="archive-link">
                                    #{gameNum}
                                    {/* {isCurrent ? `#${gameNum}` : <b>#{gameNum}</b>} */}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    )
};

export default ArchivePage;