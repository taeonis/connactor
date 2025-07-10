import './HintManager.css';
import { useGame } from '../context/GameContext';
import { getNodeType } from '../utils/nodeHelpers';

const HintManager = ({ setHintCache, hintCache}) => {
    const {showHintsFor, toggleHint} = useGame();

    const nodeType = getNodeType(showHintsFor);
    const hintIcon = hintCache[showHintsFor.data.id] === nodeType 
        ? 'https://cdn-icons-png.flaticon.com/128/427/427735.png' 
        : 'https://cdn-icons-png.flaticon.com/128/2961/2961545.png';

    return (
        <div className="hint-manager">
            <div className='title-bar'>
                <big className='name-title'>{showHintsFor.data.name || showHintsFor.data.title}</big>
                <img 
                    className={`credit-button ${hintCache[showHintsFor.data.id] == nodeType}`}
                    src={hintIcon}
                    onClick={() => setHintCache(prev => ({ ...prev, [showHintsFor.data.id]: nodeType }))}
                />
                <img 
                    className='close-button'
                    src='/delete.png'
                    onClick={() => toggleHint(null)}
                />

            </div>
            
            { hintCache[showHintsFor.data.id] === nodeType && (
                <div className='hint-box'>
                    {showHintsFor.credits.images.map((image_path, idx) => (
                        <img
                            key={idx}
                            className='hint-picture'
                            src={`https://media.themoviedb.org/t/p/w185${image_path}`}
                            alt={`Hint ${idx}`}
                        />
                    ))}
                </div>
            )}
            

        </div>
    )
}


export default HintManager;