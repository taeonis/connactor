import React, { useEffect, useState } from "react";
import Node from "./Node";
import './NodeConnector.css';
import { getPairIDS, lastNodeIsEmpty, getLastNonEmptyNode } from '../utils/nodeHelpers';

function NodeConnector() {
    const [nodes, setNodes] = useState([ { id: 1, data: null} ]);
    const [startingPerson, setStartingPerson] = useState({id: 0, data: ''});
    const [endingPerson, setEndingPerson] = useState({id: 12, data: ''});
    const [connections, setConnections] = useState({});
    const [gameOver, setgameOver] = useState(false);

    const allConnectionsTrue = Object.values(connections).length > 0 && Object.values(connections).every(Boolean);

    const setNodeData = (id, result) => {
        setNodes(prev =>
            prev.map(node =>
                node.id === id ? { ...node, data: result } : node
            )
        );
    };

    const createNextNode = () => {
        if (nodes.length < 11) {
            setNodes(prevNodes => [
                ...prevNodes,
                { id: prevNodes.length + 1, data: null }
            ]);
        }
    };
    
    const deleteLastNode = () => {
        if (nodes.length > 1) {
            delete connections[nodes.length - 1];
            setNodes(prevNodes => prevNodes.slice(0, -1));
        }
    }

    useEffect(() => {
        fetch('http://localhost:5000/api/test-pair')
            .then(res => res.json())
            .then(returnedPair => {
                setStartingPerson(prev => ({
                    ...prev,
                    data: returnedPair.starting_person
                }));
                setEndingPerson(prev => ({
                    ...prev,
                    data: returnedPair.ending_person
                }));
            })
            .catch(error => {
                console.error('Error fetching pair:', error);
            });
    }, []);

    useEffect(() => {
        console.log('Connections:', connections);
        console.log('Nodes: ', nodes);
        if (allConnectionsTrue && !gameOver) {
            setgameOver(true);
            console.log('All connections are true!');
            if (lastNodeIsEmpty(nodes)) {
                deleteLastNode();
            }
        }
        else if (!lastNodeIsEmpty(nodes) && !gameOver) {
            createNextNode();
        }
    }, [connections, allConnectionsTrue]);

    useEffect(() => {
        const fetchConnections = async () => {
            const newConnections = {};
            for (let idx = 0; idx < nodes.length; idx++) {
                const { personID, movieID } = getPairIDS(nodes, idx, startingPerson);
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

            const lastNode = getLastNonEmptyNode(nodes);
            if (lastNode?.data?.id && endingPerson.data.id) {
                try {
                    const response = await fetch(
                        `http://localhost:5000/api/connection?person_id=${endingPerson.data.id}&movie_id=${lastNode.data.id}`
                    );
                    const json = await response.json();
                    newConnections['ending'] = json.result;
                } catch (e) {
                    newConnections['ending'] = false;
                }
        }
            setConnections(newConnections);
        };
        fetchConnections();
    }, [nodes.map(n => n.data?.id).join(",")]);

    return (
        <div className='node-row'>
            <img 
                src={`https://media.themoviedb.org/t/p/w185${startingPerson.data.profile_path}`} 
                title={startingPerson.data.name || "Loading..."}
            />

            {nodes.map((node, idx) => (
                <React.Fragment key={node.id}>
                    <img src = {
                        connections[idx]
                            ? 'https://picsum.photos/id/18/367/267'
                            : 'https://picsum.photos/id/21/367/267'
                    }
                        className='chain-img'
                        style={{ width: '50px', height: '50px' } }
                    />
                    
                    <Node 
                        type={node.id % 2 === 0 ? 'person' : 'movie'}
                        selectedResult={node.data}
                        setSelectedResult={result => setNodeData(node.id, result)}
                        gameOver={gameOver}
                        nodes={[startingPerson, ...nodes, endingPerson]}
                        deleteLastNode={deleteLastNode}
                    />
                </React.Fragment>
            ))}

            <img src = {
                connections['ending']
                    ? 'https://picsum.photos/id/18/367/267'
                    : 'https://picsum.photos/id/21/367/267'
            }
                className='chain-img'
                style={{ width: '50px', height: '50px' } }
            />
            <img 
                src={`https://media.themoviedb.org/t/p/w185${endingPerson.data.profile_path}`} 
                title={endingPerson.data.name || "Loading..."}
            />
        </div>
  );
};

export default NodeConnector;