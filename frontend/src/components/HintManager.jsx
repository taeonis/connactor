import './HintManager.css';
import React, { useEffect, useState, useRef } from "react";

const HintManager = ({ node, cache, toggleHint }) => {
    const [showHints, setShowHints] = useState(false);

    console.log(cache);

    let image_paths_list = node.id % 2 === 0 ? [...cache['people'][node.data.id]['images']] : [...cache['movies'][node.data.id]['images']];
    let name_or_title = node.id % 2 === 0 ? node.data.name : node.data.title;

    useEffect(() =>{
        setShowHints(false);
    }, [node])

    return (
        <div className="hint-manager">
            <big className='name-title'>{name_or_title}</big>
            <button onClick={() => toggleHint(null)}>Close</button>
            <br />

            <div style={{color: 'white'}}>Show hints?</div>

            <label class='switch'>
                <input 
                    type='checkbox' 
                    checked={showHints}
                    onChange={() => setShowHints(prev => !prev)}
                />
                <span class='slider round'></span>
            </label>

            
            {showHints && (
                <div className='hint-box'>
                    {image_paths_list.map((image_path, idx) => (
                        <img
                            key={idx}
                            className='hint-picture'
                            src={`https://media.themoviedb.org/t/p/w185${image_path}`}
                            alt={`Hint ${idx}`}
                        />
                    ))}
                </div>
            )}
            

        </div>
    )
}


export default HintManager;