import { useState } from 'react'
import './App.css'
import NodeManager from './components/NodeManager';

function App() {

  return (
      <div className='App'>
        <big>
          MY GAME<br />
          how to play?
        </big>
        <br /><br /><br />
        <NodeManager />
      </div>
  )
}

export default App
