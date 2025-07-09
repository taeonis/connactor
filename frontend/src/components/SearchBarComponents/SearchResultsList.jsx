import React from "react";
import "./SearchResultsList.css"
import { SearchResult } from "./SearchResult";
import { getNodeType } from "../../utils/nodeHelpers";
import { useGame } from '../../context/GameContext';

export const SearchResultsList = ({ results, onResultClick, type }) => {
    const {nodes, startingPerson, endingPerson} = useGame();
    const allNodes = [startingPerson, ...nodes, endingPerson];
    
    return (
        <div className="results-list">
            {results
                .filter(result =>
                    !allNodes.some(node => {
                        return getNodeType(node) === type && node.data?.id === result.id;
                    })
                )
                .map(result => (
                    <SearchResult
                        result={result}
                        key={result.id}
                        onResultClick={onResultClick}
                        type={type}
                    />
                ))
            }
    </div>
    );
};