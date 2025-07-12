import './HintManager.css';
import { useState, forwardRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { getNodeType } from '../utils/nodeHelpers';


const HintManager = forwardRef(({ setHintCache, hintCache}, ref) => {
    const {showHintsFor, toggleHint} = useGame();
    const [loadedImages, setLoadedImages] = useState({});
    const nodeType = getNodeType(showHintsFor);
    const nameOrTitle = showHintsFor ? showHintsFor.data.name || showHintsFor.data.title : ''; 
    const hintsToggled = showHintsFor ? hintCache[showHintsFor.data.id] == nodeType : false;
    const hintIcon = hintsToggled ? /*'https://cdn-icons-png.flaticon.com/128/427/427735.png'*/ '/lit_bulb.png' : '/unlit_bulb.png';
    const hintImages = hintsToggled ? showHintsFor.credits.images : [];

    const handleImageLoad = (idx) => {
        setLoadedImages(prev => ({ ...prev, [idx]: true }));
    };

    useEffect(() => {
        setLoadedImages([]);
    }, [showHintsFor])

    return (
        <div className="hint-manager">
            <div ref={ref} className='hint-title-bar'>
                <b><big className='name-title'>{ nameOrTitle }</big></b>
                <div className='title-bar-right'>
                    <img 
                        className={`lightbulb-icon ${ hintsToggled }`}
                        src={ hintIcon }
                        onClick={() => setHintCache(prev => ({ ...prev, [showHintsFor.data.id]: nodeType }))}
                    />
                </div>

            </div>
            

            <div className={`hint-image-box`}>
                {hintImages.map((image_path, idx) => (
                    <img
                        key={idx}
                        className={`hint-image ${loadedImages[idx] ? 'loaded' : ''}`}
                        src={`https://media.themoviedb.org/t/p/w185${ image_path }`}
                        onLoad={() => handleImageLoad(idx)}
                        style={{ '--delay': `${idx * 50}ms` }}
                    />
                ))}
            </div>

            

        </div>
    )
});


export default HintManager;