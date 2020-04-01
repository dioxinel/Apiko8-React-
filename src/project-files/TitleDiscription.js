import React from 'react';
import './App.css';
import { CreateTitle } from './App';

const baseImageURL = "https://image.tmdb.org/t/p/";
const posterSize = 'w300';
const noimageImageUrl = 'https://very.ua/image/cache/no_image-300x450.jpg';


class TitleDiscription extends React.Component { 
    render() {
        const titlesList = this.props.titlesList;
        const titleData = this.props.titleData;
        return (
            <div>
                <TitlePoster posterPath={titleData.poster_path} />
               <h1>{titleData.original_title}</h1>
               <TitleOverview dataOverview={titleData.overview} />
               <TitleRecomendations 
               titlesList={titlesList}
               onTitleClick={this.props.onTitleClick} 
               />
               <VideoContainer videoData={titleData.videoData} />
            </div>
        )
    }
}


class TitlePoster extends React.Component {
    render() {
        const posterPath = this.props.posterPath;
        let url;

        if (posterPath) {
            url = `${baseImageURL}${posterSize}${this.props.posterPath}`
        } else {
            url = noimageImageUrl;
        }
        
        return (
            <div>
                <img src={url} alt='Title poster' />
            </div>
        )
    }
}


class TitleOverview extends React.Component {
    render() {
        const overview = this.props.dataOverview;
        return (
            <div>
                {overview}
            </div>
        )
    }
}


class TitleRecomendations extends React.Component {
    constructor(props) {
        super(props);

        this.handleTitleClick = this.handleTitleClick.bind(this)
    }

    handleTitleClick(e) {
        const node = e.target.closest('p');
    
        if (!node) {
            return;
          }

        e.target.classList.add('Clicked');
        this.props.onTitleClick();
    }

    render() {
        const titles = [];
        let numOfRecomendations = 5;

        if (this.props.titlesList.length === 0) {
            return (
                <p hidden={true}></p>    
            )
        }
        
        for(let titleNum in this.props.titlesList) {
            numOfRecomendations--;
            const title = this.props.titlesList[titleNum];
            titles.push(<CreateTitle
                data={title}
                key={title.id}
                onTitleClick={this.props.onTitleClick}
                />);

            if(numOfRecomendations === 0) {
                break;
            }
        }

        return (
            <div>
                <h3>Recomendations</h3>
                <div onClick={this.handleTitleClick}>
                    {titles}
                </div>
            </div>
        )
    }
}


class VideoContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayedTrailer: 1
        }
        this.handleTrailerPreviousClick = this.handleTrailerPreviousClick.bind(this);
        this.handleTrailerNextClick = this.handleTrailerNextClick.bind(this);
    }


    handleTrailerPreviousClick() {
        let displayedTrailer;
        if (this.state.displayedTrailer - 1 < 1) {
            displayedTrailer = this.props.videoData.results.length;
        } else {
            displayedTrailer = this.state.displayedTrailer - 1;
        }
        this.setState({displayedTrailer})
    }


    handleTrailerNextClick() {
        let displayedTrailer;
        if (this.state.displayedTrailer + 1 > this.props.videoData.results.length) {
            displayedTrailer = 1;
        } else {
            displayedTrailer = this.state.displayedTrailer + 1;
        }
        this.setState({displayedTrailer})
    }

    render() {
        const displayedTrailer = this.state.displayedTrailer;
        const numOfTrailers = this.props.videoData.results.length;
        if (!numOfTrailers) {
            return (
                <h3>This title don't have trailer.</h3>
            )
        }
        if (numOfTrailers === 1) {
            return (
                <div>
                <h3>Trailer</h3>
                <VideoComponent videoData={this.props.videoData} displayedTrailer={displayedTrailer} />
                </div>
            )
        }

        return (
            <div>
                <h3>Trailer</h3>
                <p>There is: {numOfTrailers} trailers, you watch {displayedTrailer}</p>
                <VideoComponent videoData={this.props.videoData} displayedTrailer={displayedTrailer} />
                <button onClick={this.handleTrailerPreviousClick}>Previous</button>
                <button onClick={this.handleTrailerNextClick}>Next</button>
            </div>
        ) 
    }
}


class VideoComponent extends React.Component {
    render() {
        const link = `https://www.youtube.com/embed/${this.props.videoData.results[this.props.displayedTrailer - 1].key}`;

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
}

export default TitleDiscription;
