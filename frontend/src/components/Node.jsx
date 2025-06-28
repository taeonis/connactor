import React, {useState} from 'react';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import './Node.css'

const Node = ({type, onSelectedResult}) => {
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [results, setResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);
    const [firstRender, setFirstRender] = useState(true);

    const toggleSearchBar = () => {
        setShowSearchBar(prev => !prev);
    };

    const handleResultClick = (result) => {
        setSelectedResult(result);
        setShowSearchBar(false);
        if (firstRender) {
            onSelectedResult();
        }
        setFirstRender(false);
    }

    let buttonText = '';
    let imgURL ='';
    if (type == 'actor') {
        buttonText = 'Add Actor';
        imgURL = `https://media.themoviedb.org/t/p/w300_and_h450_bestv2${selectedResult?.profile_path}`;
    }
    else if (type == 'movie') {
        buttonText = 'Add Movie';
        imgURL = `https://media.themoviedb.org/t/p/w300_and_h450_bestv2${selectedResult?.poster_path}`;
    }

    return (
        <div className='node-wrapper'>
            {!selectedResult ? (
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <button onClick={toggleSearchBar}>{ buttonText }</button>

                </div>
            ) : (
                <>
                    <img 
                        src={imgURL}
                        alt={`${selectedResult.name}`}
                        onClick={toggleSearchBar}
                    />
                </>
            )}

            {showSearchBar && (
                <div className='popup-overlay' onClick={toggleSearchBar}>
                    <div className='search-bar-container' onClick={e => e.stopPropagation()}>
                        <SearchBar 
                            setResults={setResults} 
                            type={type}
                        />
                        <SearchResultsList results = {results} onResultClick={handleResultClick} type={type} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Node;