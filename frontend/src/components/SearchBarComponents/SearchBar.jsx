import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

export const SearchBar = ({ setResults, type }) => {
    const [input, setInput] = useState('');
    const [debouncedInput, setDebouncedInput] = useState(input);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedInput(input);
        }, 300);

        return () => clearTimeout(timer);
    }, [input]);

    useEffect(() => {
        if (debouncedInput) {
             fetch(`/api/${type}?search=${debouncedInput}`)
             .then((response) => response.json())
             .then((json) =>  setResults(json));
        }
        else {
            setResults([]);
        }
    }, [debouncedInput, setResults]);


    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input 
                placeholder={`Search for a ${type}...`}
                value={input} 
                onChange={(e) => setInput(e.target.value)}
            />
        </div>
    );
};
