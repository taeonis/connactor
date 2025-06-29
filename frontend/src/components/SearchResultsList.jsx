import React from "react";
import "./SearchResultsList.css"
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results, onResultClick, type, nodes }) => {
    return (
        <div className="results-list">
            {results
                .filter(result =>
                    nodes.every(
                        node =>
                            node.selectedResult?.id !== result.id ||
                            node.selectedResult?.type !== result.type
                    )
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

            {/*{results.map((result, id) => {
                return <SearchResult result={result} key={id} onResultClick={onResultClick} type={type}/>;
            })} */}   
    </div>
    );
};