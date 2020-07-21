import React from 'react';
import './App.css';
import T from 'prop-types';


const baseImageURL = "https://image.tmdb.org/t/p/";

export const Poster = ({ posterPath, posterSize, className, ...props}) => {
    let url;
    if(!posterPath) {
        url = 'https://very.ua/image/cache/no_image-300x450.jpg';
    } else {
        url = `${baseImageURL}${posterSize}${posterPath}`;
    }
    
    return (
        <img src={url}
            alt='Title poster' 
            className={className} 
            {...props}/>
    )
}

Poster.protoTypes = {
    posterPath: T.string,
    posterSize: T.string,
    className: T.string
}

Poster.defaultProps = {
    className: "defaultPicture"
}