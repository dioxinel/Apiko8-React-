import React from 'react';
import './App.css';
import T from 'prop-types';

import { TextC } from './text.js'
import { Poster } from './poster';

export const Title = ({ data }) => {
    return (
        <div className='Title' id={data.id}>
            <Poster 
                posterPath={data.poster_path} 
                posterSize={'w185'} 
                className={'titlePoster'} />
            <TextC value={data.original_title} className={'titleName'}/>
        </div>   
    )
}

Title.protoTypes = {
    data: T.object.isRequired
}