import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { fetchCredits } from '../utils/nodeHelpers';
import './ArchivePage.css'
import { useEffect } from 'react';

const ArchivePage = () => {
    const navigate = useNavigate();
    const { startingPerson, setStartingPerson, endingPerson, setEndingPerson, startDate, restartGame, totalNumPairs, currentGameNum, setCurrentGameNum } = useGame();
    const connactorNums = Array.from({ length: totalNumPairs }, (_, i) => totalNumPairs - 1 - i); // numbered from today's connactor to 1

    const goHome = () => {
        navigate('/');
    }

    const getDate = (numDays) => {
        const connactorDate = new Date(startDate);
        connactorDate.setDate(connactorDate.getDate() + numDays);
        
        const yyyy = connactorDate.getFullYear();
        const mm = String(connactorDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const dd = String(connactorDate.getDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    }
    
    const clickLink = async (gameNum) => {
        if (currentGameNum != gameNum) {
            const date = getDate(gameNum);
            try {
                const response = await fetch(`/db/get-pair?date=${date}`);
                const new_pair = await response.json();

                if (new_pair.starting_person.id != startingPerson.data.id) {
                    const newStartingPerson = {id: 0, data: new_pair.starting_person, credits: {}};
                    await fetchCredits(newStartingPerson);
                    setStartingPerson(newStartingPerson);
                }
                
                if (new_pair.ending_person.id != endingPerson.data.id) {
                    const newEndingPerson = {id: 0, data: new_pair.ending_person, credits: {}};
                    await fetchCredits(newEndingPerson);
                    setEndingPerson(newEndingPerson);
                } 
                
            } catch (e) {
                console.log(`Error failed to get pair for ${date}: ${e}`);
            }
            setCurrentGameNum(gameNum);
            console.log('changed ConnactorNum', currentGameNum);
        }
        restartGame();
        goHome();
    }

    return (
        <div className='archive' style={{color: 'white'}}>
             <h1 className='archive-title'>ARCHIVE</h1>
                {/* <div className='game-container'> */}
                <div className='tile-grid'>
                    {connactorNums.map(gameNum => (
                        <button key={gameNum} className={`tile${gameNum == currentGameNum ? ' current' : ''}`} onClick={() => clickLink(gameNum)}>
                            <p className='archive-link'>#{gameNum}</p>
                        </button>
                    ))}
                </div>
                {/* </div> */}
             <button className='back-button' onClick={goHome}>Back</button>
        </div>
    )
};

export default ArchivePage;