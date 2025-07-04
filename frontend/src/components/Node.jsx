import React, {useState, forwardRef} from 'react';
import { getLastNonEmptyNode, getNodeType } from '../utils/nodeHelpers';
import './Node.css'

const Node = forwardRef(({type, selectedResult, setSelectedResult, gameOver, nodes, deleteLastNode, openSearchBar, connectionVal}, ref) => {
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
        <div class={`item node ${type} ${connectionVal}`}>
            {!selectedResult ? (
                <>
                    <img src={`/add_${type}.png`} onClick={openSearchBar}/>
                </>
            ) : (
                <>
                    <img 
                        ref={ref}
                        // key={selectedResult.id}
                        src={imgURL}
                        // alt={`${selectedResult.name}`}
                        onClick={openSearchBar}
                        title={selectedResult.id}
                    />
                    {/* { nodeIsDeletable() && !gameOver && (
                        <img class='delete-button' src='/delete.png' onClick={handleDelete} />
                    )} */}
                </>
            )}
        </div>
        </>
    );
});

export default Node;