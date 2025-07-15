import React, { useEffect, useState, useRef } from "react";
import Node from "./Node";
import StaticNode from './StaticNode';
import ConnectionLink from './ConnectionLink'
import './NodeManager.css';
import './Popups.css'
import { SearchBar } from './SearchBarComponents/SearchBar';
import { SearchResultsList } from './SearchBarComponents/SearchResultsList';
import { getLastNonEmptyNode, getNodeType, fetchCredits } from '../utils/nodeHelpers';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import * as animations from "../utils/animations";
import { useGame } from '../context/GameContext';

gsap.registerPlugin(useGSAP);

const NodeManager = ({ setShowGameOverPopup }) => {
    const { gameOver, setGameOver, nodes, setNodes, startingPerson, setStartingPerson, endingPerson, setEndingPerson } = useGame();

    const startingImgRef = useRef(null);
    const endingImgRef = useRef(null);

    const [connections, setConnections] = useState({});

    const connectionsTest = useRef([]);

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
            if (id == null) {
                setResults([])
                document.body.style.overflow = '';
            }
            else {
                document.body.style.overflow = 'hidden'
            }
            setShowSearchBarFor(id);
        }
    };

    const setNodeData = async (id, result) => {
        const updatedNode = {id: id, data: result, credits: {}};
        if (result != null) {
            await fetchCredits(updatedNode);
        }
        setNodes(prev =>
            prev.map(node =>
                node.id === id ? updatedNode : node
            )
        );
    };

    const handleResultClick = (result) => {
        setNodeData(showSearchBarFor, result);
        toggleSearchBar(null);
    }

    const createNextNode = () => {
        setNodes(prevNodes => [
            ...prevNodes,
            { id: prevNodes.length + 1, data: null, credits: {} }
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
        setGameOver(true);
        await animations.winWave(allNodeRefs);
        setShowGameOverPopup(true);
    }

    const checkConnection = (idx, direction) => {
        const thisNode = nodes[idx];
        let neighborNode;
        if (idx == 0 && direction == 'prev') {
            neighborNode = startingPerson;
        }
        else {
            neighborNode = nodes[idx - 1];
        }

        const connectionVal = thisNode.credits.IDs.has(neighborNode.data.id);
        connectionsTest.current.push(connectionVal)
        return connectionVal;
    }

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
        const newConnections = {};
        for (let idx = 0; idx < nodes.length; idx++) {
            const thisNode = nodes[idx];
            const prevNode = idx === 0 ? startingPerson : nodes[idx - 1];
            if (thisNode.data != null && prevNode.data != null) {
                const connection = thisNode.credits.IDs.has(prevNode.data.id);
                newConnections[idx] = connection;
            }
        }
        const lastNode = getLastNonEmptyNode(nodes);
        if (lastNode?.data?.id && endingPerson.data.id) {
            const connection = endingPerson.credits.IDs.has(lastNode.data.id);
            newConnections['ending'] = connection;
        }
        setConnections(newConnections);

    }, [[startingPerson, ...nodes, endingPerson].map(n => n.data?.id).join(",")]);

    useEffect(() => {
            const fetchData = async () => {
                try {
                    const res = await fetch('/api/get-starting-pair');
                    const returnedPair = await res.json();
    
                    const newStartingPerson = {id: 0, data: returnedPair.starting_person, credits: {}};
                    await fetchCredits(newStartingPerson);
                    setStartingPerson(newStartingPerson);
    
                    const newEndingPerson = {id: 12, data: returnedPair.ending_person, credits: {}};
                    await fetchCredits(newEndingPerson);
                    setEndingPerson(newEndingPerson);
    
                } catch (error) {
                    console.error('Error fetching start pair:', error);
                }
            }
            fetchData();
        }, []); 

    return (
        <div className='NodeManager'>
            <div className='node-rows-wrapper'>
                <StaticNode 
                    ref={startingImgRef}
                    person={startingPerson}
                    connectionVal={connections[0]}
                />

                {nodes.map((node, idx) => (
                    <React.Fragment key={node.id}>
                        <ConnectionLink 
                            position={idx} 
                            connectionVal={connections[idx]} 
                        />
                        <Node
                            ref={el => nodeRefs.current[idx] = el}
                            self={node}
                            setNodeData={setNodeData}
                            deleteLastNode={deleteLastNode}
                            toggleSearchBar={() => {toggleSearchBar(node.id)}}
                            connectionVal={connections[idx] || connections[idx + 1] || false}
                        />
                    </React.Fragment>
                ))}

                <ConnectionLink position={nodes.length} connectionVal={connections['ending']} />    
                <StaticNode 
                    ref={endingImgRef}
                    person={endingPerson}
                    connectionVal={connections['ending']}
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
                            />
                        </div>
                    </div> 
                )}
            </div>
        </div>
    );
};

export default NodeManager;