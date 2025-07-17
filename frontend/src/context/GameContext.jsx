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
    const [totalNumPairs, setTotalNumPairs] = useState(0);
    const [currentGameNum, setCurrentGameNum] = useState(0);

    const toggleHint = (node) => setShowHintsFor(prev => (prev === node ? null : node));

    const restartGame = () => {
        setGameOver(false);
        setNodes([{ id: 1, data: null, credits: {}}]);
        setShowHintsFor(null);
    };

    const swapStartAndEnd = () => {
        const tempData = startingPerson.data;
        const tempCredits = startingPerson.credits;
        setStartingPerson(prev => ({
            ...prev,
            data: endingPerson.data,
            credits: endingPerson.credits
        }));
        setEndingPerson(prev => ({
            ...prev,
            data: tempData,
            credits: tempCredits
        }))
    }

    const setGamePair = async (newPair) => {
        if (newPair.starting_person.id != startingPerson.data.id) {
            const newStartingPerson = {id: 0, data: newPair.starting_person, credits: {}};
            await fetchCredits(newStartingPerson);
            setStartingPerson(newStartingPerson);
        }
        
        if (newPair.ending_person.id != endingPerson.data.id) {
            const newEndingPerson = {id: 0, data: newPair.ending_person, credits: {}};
            await fetchCredits(newEndingPerson);
            setEndingPerson(newEndingPerson);
        } 
    }

    useEffect(() => {
        // if node is not currently visible (i.e. not in nodes), don't show hints for it
        if (!nodes.includes(showHintsFor)) {
            toggleHint(null);
        }
    }, [nodes])


    useEffect(() => {
        const initalizeGame = async () => {
            try {
                const [pairRes, countRes] = await Promise.all([
                    fetch('/api/get-starting-pair'),
                    fetch('/db/get-num-connactors')
                ]);

                const returnedPair = await pairRes.json();
                const pairCountData = await countRes.json();

                setGamePair(returnedPair);
                setTotalNumPairs(pairCountData.total_num);
                setCurrentGameNum(pairCountData.total_num - 1);
            } catch (error) {
                console.error('Error getting starting data:', error);
            }
        }
        initalizeGame();
    }, []); 

    const value = {
        gameOver,
        setGameOver,
        nodes,
        setNodes,
        startingPerson,
        endingPerson,
        showHintsFor,
        setShowHintsFor,
        toggleHint,
        restartGame,
        totalNumPairs,
        currentGameNum,
        setCurrentGameNum,
        setGamePair,
        swapStartAndEnd
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
