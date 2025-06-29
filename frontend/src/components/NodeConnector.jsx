import React, { useEffect, useState } from "react";
import Node from "./Node";
import './NodeConnector.css';

function NodeConnector() {
    const [nodes, setNodes] = useState([
        { id: 1, label: 'Node 1', selectedResult: null} ,
        ]);
    const [connections, setConnections] = useState({});

    const setNodeSelectedResult = (id, result) => {
        setNodes(prev =>
            prev.map(node =>
                node.id === id ? { ...node, selectedResult: result } : node
            )
        );
    };

    const createNextNode = () => {
        if (nodes.length < 5) {
            setNodes(prevNodes => [
                ...prevNodes,
                { id: prevNodes.length + 1, label: `Node ${prevNodes.length + 1}`, selectedResult: null }
            ]);
        }
    };

    const getPairIDS = (idx) => {
        let personID = '';
        let movieID = '';

        if (idx % 2 === 0) {
            movieID = nodes[idx].selectedResult?.id;
            if (idx === 0) {
                personID = '3291'; // (hugh grant) for testing
            }
            else {
                personID = nodes[idx - 1].selectedResult?.id;
            }
        }
        else {
            personID = nodes[idx].selectedResult?.id;
            movieID = nodes[idx - 1].selectedResult?.id;
        }
        console.log(`IDX: ${idx}`);
        console.log(`Person ID: ${personID}, Movie ID: ${movieID}`);

        return { personID, movieID };
    };

    useEffect(() => {
        const fetchConnections = async () => {
            const newConnections = {};
            for (let idx = 0; idx < nodes.length; idx++) {
                const { personID, movieID } = getPairIDS(idx);
                if (personID && movieID) {
                    try {
                        const response = await fetch(`http://localhost:5000/api/connection?person_id=${personID}&movie_id=${movieID}`);
                        const json = await response.json();
                        newConnections[idx] = json.result;
                    } catch (e) {
                        newConnections[idx] = false; 
                    }
                }
            }
            setConnections(newConnections);
        };
        fetchConnections();
    }, [nodes.map(n => n.selectedResult?.id).join(",")]);

    return (
        <div className='node-row'>
            <img src='https://picsum.photos/id/237/200/300' />

            {nodes.map((node, idx) => (
                <React.Fragment key={node.id}>
                    {idx < nodes.length - 1 && (
                        <img src = {
                            connections[idx]
                                ? 'https://picsum.photos/id/18/367/267'
                                : 'https://picsum.photos/id/21/367/267'
                        }
                            className='chain-img'
                            style={{ width: '50px', height: '50px' } }
                        />
                    )}

                    <Node 
                        type={idx % 2 === 0 ? 'movie' : 'person'}
                        createNextNode={createNextNode}
                        selectedResult={node.selectedResult}
                        setSelectedResult={result => setNodeSelectedResult(node.id, result)}
                    />
                </React.Fragment>
            ))}

            <img src='https://picsum.photos/id/237/200/300' />
        </div>
  );
};

export default NodeConnector;