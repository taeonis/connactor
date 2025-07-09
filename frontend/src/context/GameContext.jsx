// src/context/GameContext.js
import { createContext, useContext, useState } from 'react';

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameOver, setGameOver] = useState(false);
  const [nodes, setNodes] = useState( [{ id: 1, data: null, credits: {}}] );
  const [startingPerson, setStartingPerson] = useState( {id: 0, data: '', credits: {}} );
  const [endingPerson, setEndingPerson] = useState( {id: 12, data: '', credits: {}} );

  const value = {
    gameOver,
    setGameOver,
    nodes,
    setNodes,
    startingPerson,
    setStartingPerson,
    endingPerson,
    setEndingPerson,
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
