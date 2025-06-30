import { useState } from 'react'
import './App.css'
import { SearchBar } from './components/SearchBar'
import { SearchResultsList } from './components/SearchResultsList';
import Node from './components/Node';
import NodeConnector from './components/NodeConnector';

function App() {

  const moveImages = () => {
    setMoved(true);
  };

  return (
      <div className='App'>
        

        <div> <NodeConnector /> </div>


      </div>
  )
}

export default App
