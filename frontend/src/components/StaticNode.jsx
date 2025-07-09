import { forwardRef, useContext } from "react";
import { useGame } from '../context/GameContext';

const StaticNode = forwardRef(({ person, connectionVal }, ref) => {
    const {  gameOver, toggleHint } = useGame();

    return (
        <div ref={ref} className={`item node person`}>
            <img 
                src={`https://media.themoviedb.org/t/p/w185${person.data.profile_path}`} 
                title={person.data.id || "Loading..."}
                className={`node-image ${connectionVal}`}
            />
            {!gameOver && (
                <img className='hint-button' src='/hint_icon.png' onClick={() => toggleHint(person)} />
            )}
        </div>
    )
});

export default StaticNode;