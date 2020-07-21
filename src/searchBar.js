import React from 'react';
import './App.css';
import T from 'prop-types';

export const SearchBar = ({handleInputChange, className}) => {
    return (
    <input 
    id='searchInput' 
    className={className}
    onChange={handleInputChange} 
    placeholder='Search...'
    ></input>
    )
}

SearchBar.protoTypes = {
    handleInputChange: T.string.isRequired,
    className: T.string
}