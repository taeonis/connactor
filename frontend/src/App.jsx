import { useState } from 'react'
import './App.css'
import { SearchBar } from './components/SearchBar'
import { SearchResultsList } from './components/SearchResultsList';
import Node from './components/ActorNode';

function App() {
  const [results, setResults] = useState([]);
  const [moved, setMoved] = useState(false);

  const moveImages = () => {
    setMoved(true);
  };

  return (
      <div className='App'>
        <button onClick={moveImages}>Move & Show</button>

        <div className='figure-container'>
          <img
          id="left"
          className={`image ${moved ? 'left-move' : ''}`}
          src="https://picsum.photos/id/237/536/354"
          alt="Left"
          />
          <img
            id="middle"
            className={`middle ${moved ? 'show' : ''}`}
            src="https://picsum.photos/id/237/536/354"
            alt="Middle"
          />
          <img
            id="right"
            className={`image ${moved ? 'right-move' : ''}`}
            src="https://picsum.photos/id/237/536/354"
            alt="Right"
          />
        </div>

        <div>
          <Node />
        </div>

        {/*<div className='search-bar-container'>
          <SearchBar setResults={setResults} />
          <SearchResultsList results = {results} />
        </div>*/}

      </div>
  )
}

export default App
