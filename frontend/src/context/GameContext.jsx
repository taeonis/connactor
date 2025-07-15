// src/context/GameContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCredits } from '../utils/nodeHelpers';


export const GameContext = createContext();

export function GameProvider({ children }) {
    const [gameOver, setGameOver] = useState(false);
    const [nodes, setNodes] = useState( [{ id: 1, data: null, credits: {}}] );
    const [startingPerson, setStartingPerson] = useState( {id: 0, data: '', credits: {}} );
    const [endingPerson, setEndingPerson] = useState( {id: 12, data: '', credits: {}} );
    const [showHintsFor, setShowHintsFor] = useState(null);
    const startDate = new Date('2025-07-13');

    const toggleHint = (node) => setShowHintsFor(prev => (prev === node ? null : node));

    const restartGame = () => {
        setGameOver(false);
        setNodes([{ id: 1, data: null, credits: {}}]);
        setShowHintsFor(null);
    };

    useEffect(() => {
        // if node is not currently visible (i.e. not in nodes), don't show hints for it
        if (!nodes.includes(showHintsFor)) {
            toggleHint(null);
        }
    }, [nodes])

    

    const value = {
        gameOver,
        setGameOver,
        nodes,
        setNodes,
        startingPerson,
        setStartingPerson,
        endingPerson,
        setEndingPerson,
        showHintsFor,
        setShowHintsFor,
        toggleHint,
        startDate
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}
