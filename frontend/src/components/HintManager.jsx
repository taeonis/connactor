import './HintManager.css';
import React, { useEffect, useState, useRef } from "react";

const HintManager = ({ node, toggleHint, setHintsEnabledFor, hintsEnabledFor }) => {
    const nodeType = node.id % 2 === 0 ? 'person' : 'movie';
    const hintIcon = hintsEnabledFor[node.data.id] === nodeType 
        ? 'https://cdn-icons-png.flaticon.com/128/427/427735.png' 
        : 'https://cdn-icons-png.flaticon.com/128/2961/2961545.png';

    return (
        <div className="hint-manager">
            <div className='title-bar'>
                <big className='name-title'>{node.data.name || node.data.title}</big>
                <img src={hintIcon}
                    onClick={() => setHintsEnabledFor(prev => ({ ...prev, [node.data.id]: nodeType }))}
                />
                <img 
                    className='close-button'
                    src='/delete.png'
                    onClick={() => toggleHint(null)}
                />

            </div>
            
            { hintsEnabledFor[node.data.id] === nodeType && (
                <div className='hint-box'>
                    {node.credits.images.map((image_path, idx) => (
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