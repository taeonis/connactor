import React from "react";
import "./SearchResult.css"

export const SearchResult = ({ result, onResultClick, type }) => {

    let renderedText = '';
    if (type === 'actor') {
        renderedText = result.name;
    } else if (type === 'movie') {
        renderedText = `${result.title} (${result.release_date?.split('-')[0]})`;
    }

    return (
        <div className="search-result" onClick={() => onResultClick(result)}>
            { renderedText} 
        </div>
    );
}