import React from 'react';
import './App.css';
import T from 'prop-types';
import { SearchBar } from './searchBar';

export const Header = ({handleInputChange, handlePrevPage, pageState, className}) => {
    if(!pageState) {
        return (
            <div className={className}>
                <SearchBar 
                    handleInputChange={handleInputChange}
                    className={'searchBar'}
                />
                <button 
                    onClick={handlePrevPage}
                    className={'button'}>Back</button>
            </div>
            
        )  
    }
    return (
        <div className={className}>
                <SearchBar 
                    handleInputChange={handleInputChange}
                    className={'searchBar'}
                />
            </div>
    )
    
}

Header.protoTypes = {
    handleInputChange: T.string.isRequired,
    handlePrevPage: T.func,
    pageState: T.bool,
    className: T.string
}