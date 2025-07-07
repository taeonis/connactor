import { forwardRef } from "react";

const StaticNode = forwardRef(({ person, connectionVal, toggleHint }, ref) => {
    return (
        <div ref={ref} class={`item node person`}>
            <img 
                src={`https://media.themoviedb.org/t/p/w185${person.data.profile_path}`} 
                title={person.data.id || "Loading..."}
                className={`node-image ${connectionVal}`}
            />
            <img class='hint-button' src='/hint_icon.png' onClick={toggleHint} />
        </div>
    )
});

export default StaticNode;