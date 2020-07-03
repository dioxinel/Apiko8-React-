import React, { useState } from 'react';
import './App.css';
import { CreateTitle } from './App';

const baseImageURL = "https://image.tmdb.org/t/p/";
const posterSize = 'w300';
const noimageImageUrl = 'https://very.ua/image/cache/no_image-300x450.jpg';


function TitleDiscription(props) { 
        const titlesList = props.titlesList;
        const titleData = props.titleData;
        return (
            <div>
                <TitlePoster posterPath={titleData.poster_path} />
               <h1>{titleData.original_title}</h1>
               <TitleOverview dataOverview={titleData.overview} />
               <TitleRecomendations 
               titlesList={titlesList}
               onTitleClick={props.onTitleClick} 
               />
               <VideoContainer videoData={titleData.videoData} />
            </div>
        )
}


function TitlePoster(props) {
        const posterPath = props.posterPath;
        let url;

        if (posterPath) {
            url = `${baseImageURL}${posterSize}${props.posterPath}`
        } else {
            url = noimageImageUrl;
        }
        
        return (
            <div>
                <img src={url} alt='Title poster' />
            </div>
        )
}


function TitleOverview(props) {
        const overview = props.dataOverview;
        return (
            <div>
                {overview}
            </div>
        )
}


function TitleRecomendations(props) {
    function handleTitleClick(e) {
        const node = e.target.closest('p');
    
        if (!node) {
            return;
          }

        e.target.classList.add('Clicked');
        props.onTitleClick();
    }

        const titles = [];
        let numOfRecomendations = 5;

        if (props.titlesList.length === 0) {
            return (
                <p hidden={true}></p>    
            )
        }
        
        for(let titleNum in props.titlesList) {
            numOfRecomendations--;
            const title = props.titlesList[titleNum];
            titles.push(<CreateTitle
                data={title}
                key={title.id}
                onTitleClick={props.onTitleClick}
                />);

            if(numOfRecomendations === 0) {
                break;
            }
        }

        return (
            <div>
                <h3>Recomendations</h3>
                <div onClick={handleTitleClick}>
                    {titles}
                </div>
            </div>
        )
}


function VideoContainer(props) {
    const [displayedTrailer, setDisplayedTrailer] = useState(1);

    function handleTrailerPreviousClick() {
        let trailer;
        if (displayedTrailer - 1 < 1) {
            trailer = props.videoData.results.length;
        } else {
            trailer = displayedTrailer - 1;
        }
        setDisplayedTrailer(trailer);
    }


    function handleTrailerNextClick() {
        let trailer;
        if (displayedTrailer + 1 > props.videoData.results.length) {
            trailer = 1;
        } else {
            trailer = displayedTrailer + 1;
        }
        setDisplayedTrailer(trailer);
    }

        const numOfTrailers = props.videoData.results.length;
        if (!numOfTrailers) {
            return (
                <h3>This title don't have trailer.</h3>
            )
        }
        if (numOfTrailers === 1) {
            return (
                <div>
                <h3>Trailer</h3>
                <VideoComponent videoData={props.videoData} displayedTrailer={displayedTrailer} />
                </div>
            )
        }

        return (
            <div>
                <h3>Trailer</h3>
                <p>There is: {numOfTrailers} trailers, you watch {displayedTrailer}</p>
                <VideoComponent videoData={props.videoData} displayedTrailer={displayedTrailer} />
                <button onClick={handleTrailerPreviousClick}>Previous</button>
                <button onClick={handleTrailerNextClick}>Next</button>
            </div>
        ) 
}


function VideoComponent(props) {
        const link = `https://www.youtube.com/embed/${props.videoData.results[props.displayedTrailer - 1].key}`;

        return (
            <iframe 
                    width="560" 
                    height="315" 
                    src={link} 
                    frameBorder="0" allow="accelerometer; 
                    autoplay; 
                    encrypted-media; 
                    gyroscope; 
                    picture-in-picture" 
                    allowFullScreen
                    title='Trailer'></iframe>
        )
}

export default TitleDiscription;
