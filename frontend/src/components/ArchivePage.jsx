import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { fetchCredits } from '../utils/nodeHelpers';
import './ArchivePage.css'
import { useEffect } from 'react';

const ArchivePage = () => {
    const navigate = useNavigate();
    const { startingPerson, setStartingPerson, endingPerson, setEndingPerson, startDate, restartGame, totalNumPairs } = useGame();
    const today = new Date();
    const connactorNums = Array.from({ length: totalNumPairs }, (_, i) => totalNumPairs - 1 - i); // numbered from today's connactor to 1

    const goHome = () => {
        navigate('/');
    }

    const getDate = (n) => {
        const connactorDate = new Date(startDate);
        connactorDate.setDate(connactorDate.getDate() + n);
        
        const yyyy = connactorDate.getFullYear();
        const mm = String(connactorDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const dd = String(connactorDate.getDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    }
    
    const clickLink = async (n) => {
        const date = getDate(n);
        try {
            const response = await fetch(`/db/get-pair?date=${date}`);
            const json = await response.json();

            if (json.starting_person.id != startingPerson.data.id) {
                console.log('new starting');
                const newStartingPerson = {id: 0, data: json.starting_person, credits: {}};
                await fetchCredits(newStartingPerson);
                setStartingPerson(newStartingPerson);
            }
            
            if (json.ending_person.id != endingPerson.data.id) {
                console.log('new ending');
                const newEndingPerson = {id: 0, data: json.ending_person, credits: {}};
                await fetchCredits(newEndingPerson);
                setEndingPerson(newEndingPerson);
            } 
            
        } catch (e) {
            console.log(`Error failed to get pair for ${date}: ${e}`);
        }
        restartGame();
        goHome();
    }

    return (
        <div className='archive' style={{color: 'white'}}>
             <h1>ARCHIVE</h1>
                <ul>
                    {connactorNums.map(n => (
                        <li key={n}><button className='archive-link' onClick={() => clickLink(n)}>Connactor #{n}</button></li>
                    ))}
                </ul>
             <button onClick={goHome}>home</button>
        </div>
    )
};

export default ArchivePage;