import './Instructions.css'

const Instructions = ({ toggleInstructions }) => { 
    return (
        <div id='instructions-overlay' className='overlay' onClick={toggleInstructions}>
            <div className='popup instructions' onClick={e => e.stopPropagation()}>
                <img className='close-instructions-icon' src='/delete.png' onClick={toggleInstructions} />
                <div className='popup-text'>
                    <h2>How to play?</h2>
                    <p>
                        <hr />
                        Everyone in Hollywood is connected...
                        <hr />
                        Press the add icons ( <img className='icon-example' src='/add_movie.png' />/<img className='icon-example' src='/add_person.png' /> ) to add a movie/person to the chain. 
                        <hr />
                        The connection icons ( <img className='icon-example' src='/horizontal_link.png' />/<img className='icon-example' src='/horizontal_broken.png' /> ) between people and movies
                        indicate whether or not a person is credited to a movie.
                        <hr />
                        If every connection in your chain so far is valid, another add icon will pop up and you can continue the chain. 
                        <hr />
                        You can remove the last item in a chain by clicking <img className='icon-example' src='/delete.png' />.
                        <hr />
                        To see the name of a movie or person, press <img className='icon-example' src='/hint_icon.png' />.
                        In that bar, press 💡 to view that person's movie credits or that movie's cast. 
                        <hr />
                        You have unlimited 💡, but they are tallied and are part of your final score!
                        <hr />
                        <b>The goal of the game is to connect the starting person to the ending person in as short a chain as possible. Have fun!</b>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Instructions;