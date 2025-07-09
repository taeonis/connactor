import {forwardRef} from 'react';
import { getLastNonEmptyNode } from '../utils/nodeHelpers';
import { useGame } from '../context/GameContext';
import './Node.css'

const Node = forwardRef(({type, selectedResult, setSelectedResult, deleteLastNode, toggleSearchBar, connectionVal, toggleHint}, ref) => {
    const { gameOver, setGameOver, nodes, setNodes, startingPerson, setStartingPerson, endingPerson, setEndingPerson, } = useGame();
    const handleDelete = () => {
        setSelectedResult(null);
        deleteLastNode();
    }

    const nodeIsDeletable = () => {
        let lastNode = getLastNonEmptyNode(nodes);
        if (lastNode?.data === selectedResult) {
            return true
        }
        return false;
    }

    let buttonText = '';
    let imgURL = '';
    let altText = '';
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
        <div className={`item node ${type} `} ref={ref}>
            {!selectedResult ? (
                <>
                <img 
                    className='node-image clickable'
                    src={`/add_${type}.png`} 
                    onClick={toggleSearchBar}/>
                </>
            ) : (
                <>
                <img 
                    className={`node-image clickable ${connectionVal}`}
                    src={imgURL}
                    onClick={toggleSearchBar}
                    alt={selectedResult.name || selectedResult.title}
                />
                {!gameOver && (
                    <>
                    <img className='hint-button' src='/hint_icon.png' onClick={toggleHint} />
                    {nodeIsDeletable() && (
                        <img className='delete-button' src='/delete.png' onClick={handleDelete} />
                    )} 
                    </>
                )} 
                </>
            )}
        </div>
        </>
    );
});

export default Node;