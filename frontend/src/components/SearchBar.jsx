import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

export const SearchBar = ({ setResults }) => {
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
             fetch(`http://localhost:5000/api/users?search=${debouncedInput}`)
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
                placeholder="Type to search..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
            />
        </div>
    );
};
