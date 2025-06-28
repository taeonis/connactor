import { useState } from 'react'
import './App.css'
import { SearchBar } from './components/SearchBar'
import { SearchResultsList } from './components/SearchResultsList';
import Node from './components/Node';
import NodeConnector from './components/NodeConnector';

function App() {
  const [results, setResults] = useState([]);
  const [moved, setMoved] = useState(false);

  const [nodes, setNodes] = useState([
    { id: 1, label: 'Node 1'},
  ]);

  const addNode = () => {
    setNodes(prevNodes => [
      ...prevNodes,
      { id: prevNodes.length + 1, label: `Node ${prevNodes.length + 1}` }
    ]);
  };

  const moveImages = () => {
    setMoved(true);
  };

  return (
      <div className='App'>

        <div> <NodeConnector /> </div>

        <div class='grid-container'>
        </div>

        

        {/*<div className='search-bar-container'>
          <SearchBar setResults={setResults} />
          <SearchResultsList results = {results} />
        </div>*/}

      </div>
  )
}

export default App
