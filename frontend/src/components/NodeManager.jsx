import React, { useEffect, useState, useRef } from "react";
import Node from "./Node";
import StaticNode from './StaticNode';
import './NodeManager.css';
import ConnectionLink from './ConnectionLink'
import { SearchBar } from './SearchBar';
import { SearchResultsList } from './SearchResultsList';
import { getPairIDS, lastNodeIsEmpty, getLastNonEmptyNode, getNodeType, checkPersonInMovie, updateCache } from '../utils/nodeHelpers';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import * as animations from "../utils/animations";

gsap.registerPlugin(useGSAP);

const NodeManager = ({ nodeProps, gameOverProps, startingProps, endingProps, cache, toggleHint }) => {
    const { nodes, setNodes } = nodeProps;
    const { gameOver, setGameOver } = gameOverProps;
    const { startingPerson, setStartingPerson } = startingProps;
    const { endingPerson, setEndingPerson } = endingProps;

    const startingImgRef = useRef(null);
    const endingImgRef = useRef(null);

    const [connections, setConnections] = useState({});
    const [showSearchBarFor, setShowSearchBarFor] = useState(null);
    const [results, setResults] = useState([]);

    const nodeRefs = useRef([]);
    const allNodeRefs = [startingImgRef.current, ...nodeRefs.current, endingImgRef.current]

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

    const setNodeData = async (id, result) => {
        setNodes(prev =>
            prev.map(node =>
                node.id === id ? { ...node, data: result } : node
            )
        );

        if (result !== null) {
            const type = id % 2 === 0 ? 'people' : 'movies';
            await updateCache(cache, type, result.id);
        }
    };

    const handleResultClick = (result) => {
        setNodeData(showSearchBarFor, result);
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
        if (nodes[nodes.length - 1].data === null) {
            deleteLastNode();
        }
        await animations.winWave(allNodeRefs);
        setGameOver(true);
    }

    useEffect(() => {
        fetch('/api/test-pair')
            .then(res => res.json())
            .then(returnedPair => {
                setStartingPerson(prev => ({
                    ...prev,
                    data: returnedPair.starting_person
                }));
                updateCache(cache, 'people', returnedPair.starting_person.id);

                setEndingPerson(prev => ({
                    ...prev,
                    data: returnedPair.ending_person
                }));
                updateCache(cache, 'people', returnedPair.ending_person.id);
            })
            .catch(error => {
                console.error('Error fetching pair:', error);
            });
    }, []); 

    useEffect(() => {
        // console.log('Connections:', connections);
        // console.log('Nodes: ', nodes);
        // console.log('NodeRefs: ', nodeRefs);
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
                    const connection = await checkPersonInMovie(cache, personID, movieID);
                    newConnections[idx] = connection;
                }
            }
            const lastNode = getLastNonEmptyNode(nodes);
            if (lastNode?.data?.id && endingPerson.data.id) {
                const connection = await checkPersonInMovie(cache, endingPerson.data.id, lastNode.data.id);
                newConnections['ending'] = connection;
            }
            setConnections(newConnections);
        };
        fetchConnections();
    }, [[startingPerson, ...nodes, endingPerson].map(n => n.data?.id).join(",")]);

    return (
        <div className='NodeManager'>
            <div className='node-rows-wrapper'>
                <StaticNode 
                    ref={startingImgRef}
                    person={startingPerson}
                    connectionVal={connections[0]}
                    toggleHint={() => toggleHint(startingPerson)}
                />

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
                            toggleSearchBar={() => {toggleSearchBar(node.id)}}
                            connectionVal={connections[idx] || connections[idx + 1] || false}
                            toggleHint={() => toggleHint(node)}
                        />
                    </React.Fragment>
                ))}

                <ConnectionLink position={nodes.length} connectionVal={connections['ending']} />    
                <StaticNode 
                    ref={endingImgRef}
                    person={endingPerson}
                    connectionVal={connections['ending']}
                    toggleHint={() => toggleHint(endingPerson)}
                />
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