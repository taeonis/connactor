import React, { useEffect, useState, useRef } from "react";
import Node from "./Node";
import './NodeManager.css';
import ConnectionLink from './ConnectionLink'
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import { getPairIDS, lastNodeIsEmpty, getLastNonEmptyNode, getNodeType, checkPersonInMovie } from '../utils/nodeHelpers';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import * as animations from "../utils/animations";

gsap.registerPlugin(useGSAP);

const NodeManager = ({ nodes, setNodes, gameOver, setGameOver }) => {
    //const [nodes, setNodes] = useState([ { id: 1, data: null} ]);
    const nodeRefs = useRef([]);
    const [startingPerson, setStartingPerson] = useState({id: 0, data: ''});
    const startingImgRef = useRef(null);
    const [endingPerson, setEndingPerson] = useState({id: 12, data: ''});
    const endingImgRef = useRef(null);
    const allNodeRefs = [startingImgRef.current, ...nodeRefs.current, endingImgRef.current];
    const [connections, setConnections] = useState({});
    const [showSearchBarFor, setShowSearchBarFor] = useState(null);
    const [results, setResults] = useState([]);

    const cached_filmographies = useRef({});

    const validChain = Object.values(connections).length > 0 && Object.entries(connections)
        .filter(([key]) => key !== 'ending')
        .every(([, value]) => Boolean(value));
    const allConnectionsTrue = validChain && connections['ending'];

    
    const toggleSearchBar = (id) => {
        if (!gameOver) {
            setShowSearchBarFor(id);
            if (id == null) {
                setResults([])
            }
        }
    };

    const setNodeData = (id, result) => {
        setNodes(prev =>
            prev.map(node =>
                node.id === id ? { ...node, data: result } : node
            )
        );
        if (connections[id - 1]) {
            animations.correctJump(nodeRefs.current[nodes.length - 1]);
        }
    };

    const handleResultClick = (result) => {
        setNodeData(showSearchBarFor, result);
        //('updating node data for id:', showSearchBarFor, 'with result:', result);
        toggleSearchBar(null);
    }

    const createNextNode = () => {
        let new_nodes = document.getElementsByClassName('new');

        console.log(new_nodes);
        setNodes(prevNodes => [
            ...prevNodes,
            { id: prevNodes.length + 1, data: null }
        ]);
    };
    
    const deleteLastNode = () => {
        if (nodes.length > 1) {
            delete connections[nodes.length - 1];
            setNodes(prevNodes => prevNodes.slice(0, -1));
        }
    }

    const gameOverRoutine = async () => {
        console.log('All connections are true!');
        if (lastNodeIsEmpty(nodes)) {
            deleteLastNode();
        }
        await animations.winWave(allNodeRefs);
        setGameOver(true);
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
        console.log('NodeRefs: ', nodeRefs);
        // console.log('showSearchBarFor: ', showSearchBarFor);

        const lastNode = nodes[nodes.length - 1];
        if (allConnectionsTrue && !gameOver) {
            gameOverRoutine();
        }
        else if (validChain && lastNode.data !== null && !gameOver && nodes.length < 11) {
            createNextNode();
        }
        else {
            animations.incorrectShake(nodeRefs.current, connections);
        }
    }, [connections, allConnectionsTrue]);

    useEffect(() => {
        const fetchConnections = async () => {
            const newConnections = {};
            for (let idx = 0; idx < nodes.length; idx++) {
                const { personID, movieID } = getPairIDS(nodes, idx, startingPerson);
                if (personID && movieID) {
                    const connection = await checkPersonInMovie(cached_filmographies, personID, movieID);
                    newConnections[idx] = connection;
                }
            }
            const lastNode = getLastNonEmptyNode(nodes);
            if (lastNode?.data?.id && endingPerson.data.id) {
                const connection = await checkPersonInMovie(cached_filmographies, endingPerson.data.id, lastNode.data.id);
                newConnections['ending'] = connection;
            }
            setConnections(newConnections);
        };
        fetchConnections();
    }, [nodes.map(n => n.data?.id).join(",")]);

    return (
        <div class='NodeManager'>
            <div className='node-rows-wrapper'>
                <div id='starting' class={`item node person ${connections[0]}`}>
                    <img 
                        ref={startingImgRef}
                        src={`https://media.themoviedb.org/t/p/w185${startingPerson.data.profile_path}`} 
                        title={startingPerson.data.id || "Loading..."}
                    />
                </div>

                {nodes.map((node, idx) => (
                    <React.Fragment key={node.id}>
                        <ConnectionLink 
                            position={idx} 
                            connectionVal={connections[idx]} 
                        />
                        <Node
                            ref={el => nodeRefs.current[idx] = el}
                            type={node.id % 2 === 0 ? 'person' : 'movie'}
                            selectedResult={node.data}
                            setSelectedResult={result => setNodeData(node.id, result)}
                            gameOver={gameOver}
                            nodes={[startingPerson, ...nodes, endingPerson]}
                            deleteLastNode={deleteLastNode}
                            openSearchBar={() => {toggleSearchBar(node.id)}}
                            connectionVal={connections[idx] || connections[idx + 1] || false}
                        />
                    </React.Fragment>
                ))}

                <ConnectionLink position={nodes.length} connectionVal={connections['ending']} />
                <div class={`item node person ${connections['ending']}`}>
                    <img
                        ref={endingImgRef}
                        src={`https://media.themoviedb.org/t/p/w185${endingPerson.data.profile_path}`} 
                        title={endingPerson.data.id || "Loading..."}
                    />
                </div>
            </div>

            <div className='search-bar-wrapper'>
                {showSearchBarFor !== null && (
                   <div className='popup-overlay' onClick={() => toggleSearchBar(null)}>
                        <div className='search-bar-container' onClick={e => e.stopPropagation()}>
                            <SearchBar 
                                setResults={setResults} 
                                type={getNodeType(nodes[showSearchBarFor - 1])}
                            />
                            <SearchResultsList 
                                results = {results} 
                                onResultClick={handleResultClick} 
                                type={getNodeType(nodes[showSearchBarFor - 1])} 
                                nodes={[startingPerson, ...nodes, endingPerson]}
                            />
                        </div>
                    </div> 
                )}
            </div>
        </div>
    );
};

export default NodeManager;