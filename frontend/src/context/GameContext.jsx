// src/context/GameContext.js
import { createContext, useContext, useState, useEffect } from 'react';

export const GameContext = createContext();

export function GameProvider({ children }) {
    const [gameOver, setGameOver] = useState(false);
    const [nodes, setNodes] = useState( [{ id: 1, data: null, credits: {}}] );
    const [startingPerson, setStartingPerson] = useState( {id: 0, data: '', credits: {}} );
    const [endingPerson, setEndingPerson] = useState( {id: 12, data: '', credits: {}} );
    const [showHintsFor, setShowHintsFor] = useState(null);

    const toggleHint = (node) => setShowHintsFor(prev => (prev === node ? null : node));

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
        toggleHint
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
