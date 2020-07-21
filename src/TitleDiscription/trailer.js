import React, { useState } from 'react';
import T from 'prop-types';

export const Trailer = ({ videoData }) => {
    const [displayedTrailer, setDisplayedTrailer] = useState(1);

    const handleTrailerChange = (e) => {
        const but = e.target.closest('button');

        if (!but) {
            return
        }

        if(but.innerHTML === 'Next') {
            if(displayedTrailer + 1 > videoData.results.length) {
                setDisplayedTrailer(1);
                return
            }
            setDisplayedTrailer(displayedTrailer + 1);
        } else {
            if (displayedTrailer - 1 < 1) {
                setDisplayedTrailer(videoData.results.length);
                return
            }
            setDisplayedTrailer(displayedTrailer - 1)
        }

    }

    if(videoData.results.length === 0) {
        return (
            <div>
                <h3>This title don't have trailer.</h3>
            </div>
        )
    }

    const trailerLink = `https://www.youtube.com/embed/${videoData.results[displayedTrailer - 1].key}`;

    if(videoData.results.length === 1) {
        return (
            <div>
                <h3>Trailer</h3>
                <iframe 
                    width="560" 
                    height="315" 
                    src={trailerLink} 
                    frameBorder="0" allow="accelerometer; 
                    autoplay; 
                    encrypted-media; 
                    gyroscope; 
                    picture-in-picture" 
                    allowFullScreen
                    title='Trailer'></iframe>
            </div>
        )
    }


    return (
        <div onClick={handleTrailerChange}>
            <h3>Trailer</h3>
            <p>There is: {videoData.results.length} trailers, you watch {displayedTrailer}</p>
            <iframe 
                    width="560" 
                    height="315" 
                    src={trailerLink} 
                    frameBorder="0" allow="accelerometer; 
                    autoplay; 
                    encrypted-media; 
                    gyroscope; 
                    picture-in-picture" 
                    allowFullScreen
                    title='Trailer'></iframe>
            <button className={'button'}>Previous</button>
            <button className={'button'}>Next</button>
        </div>
    )
}



Trailer.protoTypes = {
    videoData: T.object.isRequired,
}

