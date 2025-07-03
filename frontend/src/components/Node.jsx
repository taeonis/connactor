import React, {useState} from 'react';
import { getLastNonEmptyNode, getNodeType } from '../utils/nodeHelpers';
import './Node.css'

const Node = ({type, selectedResult, setSelectedResult, gameOver, nodes, deleteLastNode, openSearchBar, connectionVal}) => {

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
                    {/* <button onClick={openSearchBar}>{ buttonText }</button> */}
                    <img src={`/add_${type}.png`} onClick={openSearchBar}/>
                </>
            ) : (
                <>
                    <img 
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
};

export default Node;