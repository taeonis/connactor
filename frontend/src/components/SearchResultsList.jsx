import React from "react";
import "./SearchResultsList.css"
import { SearchResult } from "./SearchResult";
import { getNodeType } from "../utils/nodeHelpers";

export const SearchResultsList = ({ results, onResultClick, type, nodes }) => {
    /**
     * This component renders a list of search results.
     * It filters out results that are already present in the nodes array based on the type.
     * 
     * @param {Array} results - The search results to display.
     * @param {Function} onResultClick - Callback function to handle result clicks.
     * @param {String} type - The type of result ('movie' or 'person').
     * @param {Array} nodes - The current nodes in the graph.
     */

    return (
        <div className="results-list">
            {results
                .filter(result =>
                    !nodes.some(node => {
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

            {/*{results.map((result, id) => {
                return <SearchResult result={result} key={id} onResultClick={onResultClick} type={type}/>;
            })} */}   
    </div>
    );
};