import React, {useState} from 'react';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import './ActorNode.css'

const Node = () => {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [results, setResults] = useState([]);

    const toggleSearchBar = () => {
        setShowSearchBar(prev => !prev);
    };

    return (
        <div className='node-wrapper'>
            <button onClick={toggleSearchBar}>Add Actor</button>
            <button>Add Movie</button>

            {showSearchBar && (
                <div className='popup-overlay' onClick={toggleSearchBar}>
                    <div className='search-bar-container' onClick={e => e.stopPropagation()}>
                        <SearchBar setResults={setResults} />
                        <SearchResultsList results = {results} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Node;