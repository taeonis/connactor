import React from "react";
import "./SearchResultsList.css"
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results, onResultClick }) => {
    return (
        <div className="results-list">
            {results.map((result, id) => {
                return <SearchResult result={result} key={id} onResultClick={onResultClick} />;
            })}    
    </div>
    );
};