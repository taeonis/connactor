import React, {useState} from 'react';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import './Node.css'

const Node = ({type, createNextNode, selectedResult, setSelectedResult, gameOver, nodes}) => {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [results, setResults] = useState([]);
    const [firstRender, setFirstRender] = useState(true);

    const toggleSearchBar = () => {
        if (!gameOver) {
            setShowSearchBar(prev => !prev);
        }
    };

    const handleResultClick = (result) => {
        setSelectedResult(result);
        setShowSearchBar(false);
        if (firstRender) {
            createNextNode();
            setFirstRender(false);
        }
    }

    let buttonText = '';
    let imgURL ='';
    if (type == 'person') {
        buttonText = 'Add Person';
        imgURL = `https://media.themoviedb.org/t/p/w185${selectedResult?.profile_path}`;
    }
    else if (type == 'movie') {
        buttonText = 'Add Movie';
        imgURL = `https://media.themoviedb.org/t/p/w154${selectedResult?.poster_path}`;
    }

    return (
        <div className='node-wrapper'>
            {!selectedResult ? (
                <div >
                    <button onClick={toggleSearchBar}>{ buttonText }</button>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <img 
                        src={imgURL}
                        alt={`${selectedResult.name}`}
                        onClick={toggleSearchBar}
                    />
                    <button>{'Remove'}</button>
                </div>
            )}

            {showSearchBar && (
                <div className='popup-overlay' onClick={toggleSearchBar}>
                    <div className='search-bar-container' onClick={e => e.stopPropagation()}>
                        <SearchBar 
                            setResults={setResults} 
                            type={type}
                        />
                        <SearchResultsList 
                            results = {results} 
                            onResultClick={handleResultClick} 
                            type={type} 
                            nodes={nodes}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Node;