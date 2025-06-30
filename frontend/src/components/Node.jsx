import React, {useState} from 'react';
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import { getLastNonEmptyNode, getNodeType, isLastDynamicNode } from '../utils/nodeHelpers';
import './Node.css'

const Node = ({type, selectedResult, setSelectedResult, gameOver, nodes, deleteLastNode}) => {
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
            setFirstRender(false);
        }
    }

    const handleDelete = () => {
        setSelectedResult(null);
        deleteLastNode();
    }

    const nodeIsDeletable = () => {
        let lastNode = getLastNonEmptyNode(nodes, true);

        if (lastNode?.data?.id === selectedResult?.id && getNodeType(lastNode) === type) {
            return true
        }

        return false;
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
        <>
        <div className='node-wrapper'>
            {!selectedResult ? (
                <div>
                    <button onClick={toggleSearchBar}>{ buttonText }</button>
                </div>
            ) : (
                <div >
                    <img 
                        src={imgURL}
                        alt={`${selectedResult.name}`}
                        onClick={toggleSearchBar}
                    />
                    { nodeIsDeletable() && !gameOver
                        ? <button onClick={handleDelete}>{'Remove'}</button>
                        : <></>
                    }
                </div>
            )}
        </div>
        
        <div className='search-bar-wrapper'>
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
        </>
    );
};

export default Node;