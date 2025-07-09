import './Instructions.css'

const Instructions = ({ toggleInstructions }) => { 
    return (
        <div id='instructionsOverlay' className='overlay' onClick={toggleInstructions}>
            <div className='InstructionsPopup'>
                <h2>How to play?</h2>
                <p>Everyone in Hollywood is connected...</p>
                <p>If you've ever played Seven Degrees of Kevin Bacon, this game is essentially that. The goal is connect the starting person to the ending person using as few intermediate people as possible.</p>
                <p>So this is a valid solution...</p>
                <img className='long-chain' src='/long_chain.png'/>
                <p>...but this is better!</p>
                <img className='short-chain' src='/short_chain.png'/>
                <p>Click on </p>
                <img src='/hint_icon.png'/>
                <p>to view the name of the person/title of the movie. Click on the lightbulb and use a hint to view that person's movie credits or that movie's cast</p>
            </div>
        </div>
    )
}

export default Instructions;