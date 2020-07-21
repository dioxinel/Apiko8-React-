import React from 'react';
import T from 'prop-types';

import { Poster } from '../poster';
import { TextC } from '../text';
import { Trailer } from './trailer';
import { Recommendations } from './recommendations';

export const TitleDiscription = ({ titleData, pageState, onTitleClick }) => {
    return (
        <div className={'discriptWrapp'}>
            <Poster 
                posterPath={titleData.poster_path} 
                posterSize={'w300'} 
                className={'discriptPoster'} />
            <TextC value={titleData.original_title} className={'titleDiscriptionName'}/>
            <TextC value={titleData.overview} className={'preview'}/>
            <Recommendations 
                data={titleData.recommendations} 
                pageState={pageState} 
                onTitleClick={onTitleClick} />
            <Trailer videoData={titleData.videoData} />
        </div>
    )
}

TitleDiscription.protoTypes = {
    titleData: T.object.isRequired,
    pageState: T.bool.isRequired,
    onTitleClick: T.func.isRequired
}
