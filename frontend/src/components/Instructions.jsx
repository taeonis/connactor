import './Popups.css';
import { forwardRef, useEffect } from 'react';
import * as animations from "../utils/animations";

const InstructionsPopup = forwardRef(({ show, toggleInstructions }, ref) => { 
    useEffect(() => {
        if (show && show != 'closing') {
            animations.openPopup(ref);
        } else if (show == 'closing') {
            animations.closePopup(ref);
        }
    }, [show]);

    return (
        <div className='popup-overlay' onClick={toggleInstructions}>
            <div ref={ref} className='popup instructions' onClick={e => e.stopPropagation()}>
                <img className='close-popup-icon' src='/delete.png' onClick={toggleInstructions} />
                <div className='popup-text'>
                    <h2>How to play?</h2>
                    <hr />
                    <hr />
                    <p>Everyone in Hollywood is connected...</p>
                    <hr />
                    <p>Press the add icons ( <img className='icon-example' src='/add_movie.png' /> / <img className='icon-example' src='/add_person.png' /> ) to add a movie/person to the chain.</p> 
                    <hr />
                    <p>The connection icons ( <img className='icon-example' src='/horizontal_link.png' /> / <img className='icon-example' src='/horizontal_broken.png' /> ) between people and movies
                        indicate whether or not a person is credited to a movie.</p>
                    <hr />
                    <p>If every connection in your chain so far is valid, another add icon will appear and you can continue the chain.</p>
                    <hr />
                    <p>You can swap the starting actor and ending actor by pressing ( <img className='icon-example' src='/swap.png' /> ).</p>
                    <hr />
                    <p>You can change an item by pressing it, or remove it entirely by pressing (<img className='icon-example' src='/delete.png' />).</p>
                    <hr />
                    <p>To see the name of a movie or person, press ( <img className='icon-example' src='/hint_icon.png' /> ).
                        In that bar, press ( 💡 ) to view that person's movie credits or that movie's cast.</p> 
                    <hr />
                    <p>You have unlimited ( 💡 ), but they are tallied and are part of your final score!</p>
                    <hr />
                    <hr />
                    <p><b>The goal of the game is to connect the starting person to the ending person in as short a chain as possible. Have fun!</b></p>
                    <hr />
                    <hr />
                </div>
            </div>
        </div>
    )
});

export default InstructionsPopup;