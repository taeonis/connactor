import React, {useState} from 'react';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import './ActorNode.css'

const Node = () => {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [results, setResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);

    const toggleSearchBar = () => {
        setShowSearchBar(prev => !prev);
    };

    const handleResultClick = (result) => {
        setSelectedResult(result);
        setShowSearchBar(false);
    }

    return (
        <div className='node-wrapper'>
            {!selectedResult ? (
                <>
                    <button onClick={toggleSearchBar}>Add Actor</button>
                    <button>Add Movie</button>
                </>
            ) : (
                <img src={`https://media.themoviedb.org/t/p/w300_and_h450_bestv2${selectedResult.profile_path}`}></img>
            )}

            {showSearchBar && (
                <div className='popup-overlay' onClick={toggleSearchBar}>
                    <div className='search-bar-container' onClick={e => e.stopPropagation()}>
                        <SearchBar setResults={setResults} />
                        <SearchResultsList results = {results} onResultClick={handleResultClick} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Node;