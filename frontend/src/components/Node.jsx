import { forwardRef } from 'react';
import { getLastNonEmptyNode, getNodeType } from '../utils/nodeHelpers';
import { useGame } from '../context/GameContext';
import './Node.css'

const Node = forwardRef(({self, setNodeData, deleteLastNode, toggleSearchBar, connectionVal}, ref) => {
    const { gameOver, nodes, toggleHint } = useGame();
    const nodeType = getNodeType(self);
    const isLastNode = getLastNonEmptyNode(nodes)?.data == self.data;
    const imgSrc = nodeType == 'person' ? `https://media.themoviedb.org/t/p/w185${self.data?.profile_path}` : `https://media.themoviedb.org/t/p/w154${self.data?.poster_path}`;
    const clickable = !gameOver ? ' clickable' : '';

    const handleDelete = () => {
        setNodeData(self.id, null);
        deleteLastNode();
    }

    return (
        <div className={`item node ${nodeType} `} ref={ref}>
            {!self.data ? (
                <img 
                    className={`node-image${clickable}`}
                    src={`/add_${nodeType}.png`} 
                    onClick={toggleSearchBar}
                />
            ) : (
                <><img 
                    className={`node-image ${connectionVal}${clickable}`}
                    src={imgSrc}
                    onClick={toggleSearchBar}
                    alt={self.data.name || self.data.title}
                />
                {!gameOver && (
                    <><img className='hint-button' src='/hint_icon.png' onClick={() => toggleHint(self)} />
                    {isLastNode && (
                        <img className='delete-button' src='/delete.png' onClick={handleDelete} />
                    )}</>
                )}</>
            )}
        </div>
    );
});

export default Node;