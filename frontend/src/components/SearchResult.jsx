import React from "react";
import "./SearchResult.css"

export const SearchResult = ({ result, onResultClick }) => {
    return (
        <div 
            className="search-result"
            onClick={() => onResultClick(result)}
        >
            {result.name}
        </div>
    );
}