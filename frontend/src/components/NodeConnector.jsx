import React, { useState } from "react";
import Node from "./Node";
import './NodeConnector.css';

function NodeConnector() {
    const [nodes, setNodes] = useState([
        { id: 1, label: 'Node 1'},
    ]);

    const addNode = () => {
        setNodes(prevNodes => [
            ...prevNodes,
            { id: prevNodes.length + 1, label: `Node ${prevNodes.length + 1}` }
        ]);
    };

    const handleSelectedResult = () => {
        if (nodes.length < 5) {
            addNode();
        }
    }

    const handleDataUpdate = (index, newData) => {
        const updatedNodes = [...nodes];
        updatedNodes[index].data = newData
        setNodes(updatedNodes);

        if (index > 0) compareNodes(updatedNodes[index - 1], newData);
        if (index < updatedNodes.length - 1) compareNodes(updatedNodes[index + 1], newData);
    };

    const compareNodes = (nodeA, nodeB) => {
        if (nodeA.data && nodeB.data) {
            // Implement your comparison logic here
            console.log(`Comparing Node ${nodeA.id} with Node ${nodeB.id}`);
            // Example: Check if data is equal
            if (nodeA.data === nodeB.data) {
                console.log(`Node ${nodeA.id} and Node ${nodeB.id} are equal.`);
            } else {
                console.log(`Node ${nodeA.id} and Node ${nodeB.id} are different.`);
            }
        }
    };

    return (
        <div className='node-row'>
            <img src='https://picsum.photos/id/237/200/300' />
            {nodes.map(node => (
                <Node 
                    key={node.id} 
                    type={node.id % 2 === 0 ? 'actor' : 'movie'}
                    onSelectedResult={handleSelectedResult}
                />
            ))}
            <img src='https://picsum.photos/id/237/200/300' />
        </div>
  );
};

export default NodeConnector;