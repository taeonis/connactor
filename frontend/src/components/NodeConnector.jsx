import React, { useEffect, useState } from "react";
import Node from "./Node";
import './NodeConnector.css';

function NodeConnector() {
    const [nodes, setNodes] = useState([
        { id: 1, data: null} ,
        ]);
    const [connections, setConnections] = useState({});
    const [startingPerson, setStartingPerson] = useState('');
    const [endingPerson, setEndingPerson] = useState('');
    const allConnectionsTrue = Object.values(connections).length > 0 && Object.values(connections).every(Boolean);
    const [gameOverState, setGameOverState] = useState(false);

    const setNodedata = (id, result) => {
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

    const getPairIDS = (idx) => {
        let personID = '';
        let movieID = '';

        if (idx % 2 === 0) {
            movieID = nodes[idx].data?.id;
            if (idx === 0) {
                personID = startingPerson?.id;
            }
            else {
                personID = nodes[idx - 1].data?.id;
            }
        }
        else {
            personID = nodes[idx].data?.id;
            movieID = nodes[idx - 1].data?.id;
        }
        console.log(`IDX: ${idx}`);
        console.log(`Person ID: ${personID}, Movie ID: ${movieID}`);

        return { personID, movieID };
    };

    useEffect(() => {
        fetch('http://localhost:5000/api/test-pair')
            .then(res => res.json())
            .then(returnedPair => {
                setStartingPerson(returnedPair.starting_person);
                setEndingPerson(returnedPair.ending_person);
                console.log('Starting Person:', startingPerson.name);
                console.log('Ending Person:', endingPerson.name);
            })
            .catch(error => {
                console.error('Error fetching pair:', error);
            });
    }, []);

    useEffect(() => {
        console.log('Connections:', connections);
        console.log('Nodes: ', nodes);
        if (allConnectionsTrue && !gameOverState) {
            setGameOverState(true);
            console.log('All connections are true!');
            if (nodes.length > 1 && nodes.length < 11) {
                setNodes(prevNodes => prevNodes.slice(0, -1));
            }
        }
    }, [connections, allConnectionsTrue]);

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

            const lastNode = nodes[nodes.length - 1].data ? nodes[nodes.length - 1] : nodes[nodes.length - 2];
            if (lastNode?.data?.id && endingPerson?.id) {
                try {
                    const response = await fetch(
                        `http://localhost:5000/api/connection?person_id=${endingPerson.id}&movie_id=${lastNode.data.id}`
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
                src={`https://media.themoviedb.org/t/p/w185${startingPerson?.profile_path}`} 
                title={startingPerson?.name || "Loading..."}
            />

            {nodes.map((node, idx) => (
                <React.Fragment key={node.id}>
                    {node.data && (
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
                        selectedResult={node.data}
                        setSelectedResult={result => setNodedata(node.id, result)}
                        gameOver={gameOverState}
                        nodes={[startingPerson, ...nodes, endingPerson]}
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
                src={`https://media.themoviedb.org/t/p/w185${endingPerson?.profile_path}`} 
                title={endingPerson?.name || "Loading..."}
            />
        </div>
  );
};

export default NodeConnector;