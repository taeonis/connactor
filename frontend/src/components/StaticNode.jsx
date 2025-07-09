import { forwardRef, useContext } from "react";
import { useGame } from '../context/GameContext';

const StaticNode = forwardRef(({ person, connectionVal, toggleHint }, ref) => {
    const { nodes, startingPerson, endingPerson, gameOver } = useGame();

    return (
        <div ref={ref} className={`item node person`}>
            <img 
                src={`https://media.themoviedb.org/t/p/w185${person.data.profile_path}`} 
                title={person.data.id || "Loading..."}
                className={`node-image ${connectionVal}`}
            />
            {!gameOver && (
                <img className='hint-button' src='/hint_icon.png' onClick={toggleHint} />
            )}
        </div>
    )
});

export default StaticNode;