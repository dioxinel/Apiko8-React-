import React, { Fragment } from 'react';
import './App.css';

const noimageImageUrl = 'https://748073e22e8db794416a-cc51ef6b37841580002827d4d94d19b6.ssl.cf3.rackcdn.com/not-found.png';
const baseURL = 'https://api.themoviedb.org/3/';
const APIKEY = '21f53b102f9fcc68f706abfc92770539';
const baseImageURL = "https://image.tmdb.org/t/p/";
const posterSize = 'w300';


class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {searchText: ''}

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }


    handleInputChange(e) {
        this.setState({searchText: e.target.value});
    }


    handleButtonClick() {
        this.props.onButtonClick(this.state.searchText);
        this.setState({searchText: ''})
        document.getElementById('searchInput').value = '';
    }


    render() {
        return (
            <Fragment>
                <input id='searchInput' onChange={this.handleInputChange} placeholder='Search...'></input>
                <button onClick={this.handleButtonClick}>Search</button>
            </Fragment>
        )
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleData: [],
            titlesList: [], // At start page contains main titles list, in title discription contains recomendation list
            outputState: true,  // If true return list of titles, if false return title discription
            numOfPagesInList: '',
        }
        this.handleTitleClick = this.handleTitleClick.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }


    handleButtonClick(searchText, pageNum = 1) {
        let url;
        if (!searchText) {
            url = `${baseURL}trending/movie/week?api_key=${APIKEY}&language=en-US&page=${pageNum}`    
        } else {
            url = `${baseURL}search/movie?api_key=${APIKEY}&query=${searchText}&language=en-US&page=${pageNum}`
        }

        fetch(url)
        .then(result=>result.json())
        .then((data) => {
            this.setState({
                titlesList: data.results, 
                outputState: true,
                numOfPagesInList: data.total_pages,
                searchText: searchText
            })
        })
    }


    handlePageClick() {
        let page = document.querySelectorAll('.ClickedPage')[0];
        page.classList.remove('ClickedPage');
        let searchText;
        try {
            searchText = document.getElementById('userFilter').innerHTML.slice(17);
        } catch {
            searchText = '';
        }
        this.handleButtonClick(searchText, page.id)
    }



    handleTitleClick() {
        const title = document.querySelectorAll('.Clicked')[0];
        title.classList.remove('.Clicked');
        let titleData;
        const titlesList = [...this.state.titlesList];
        for (let item in titlesList) {
            if (titlesList[item].id + '' === title.id) {
                titleData = titlesList[item];
                break;
            }
        }
        
        const url = `${baseURL}movie/${title.id}/recommendations?api_key=${APIKEY}&language=en-US&page=1`
        const videoUrl = `${baseURL}movie/${title.id}/videos?api_key=${APIKEY}&language=en-US`
        fetch(url)
            .then(result=>result.json())
            .then((titlesList)=>{
                fetch(videoUrl)
                    .then(result=>result.json())
                    .then((videoData)=>{
                        titleData.videoData = videoData;
                        this.setState({
                            titleData,
                            titlesList: titlesList.results,
                            outputState: false,
                        })  
            })
        })      
    }


    componentDidMount() {
        this.handleButtonClick();
    }


    render() {
        return(
            <Fragment>
                <SearchBar  
                onButtonClick={this.handleButtonClick} 
                />
                <OutputComponent
                    titleData={this.state.titleData}
                    titlesList={this.state.titlesList}
                    outputState={this.state.outputState}
                    numOfPagesInList={this.state.numOfPagesInList}
                    onButtonClick={this.handleButtonClick}
                    onPageClick={this.handlePageClick}
                    onTitleClick={this.handleTitleClick}
                    searchText={this.state.searchText}
                    />
            </Fragment>
        )
    }
}


class OutputComponent extends React.Component {
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
        if (this.props.outputState) {
            const titlesList = this.props.titlesList;
            const titles = [];
            if (this.props.searchText) {
            titles.push(<h3 id='userFilter' key={'Uniqe'}>{'You looking for: ' + this.props.searchText}</h3>)
            } 
            titlesList.map((title) => {
                return titles.push(<CreateTitle
                    data={title}
                    key={title.id}
                    onTitleClick={this.handleTitleClick}
                />);
            })
            return (
                <div> 
                    <div onClick={this.handleTitleClick}>
                        {titles}
                    </div>
                    
                    <Pagination 
                        numOfPagesInList={this.props.numOfPagesInList}
                        onPageClick={this.props.onPageClick}
                        />
                </div>
            )
        }

        return (<TitleDiscription 
            onTitleClick={this.props.onTitleClick}
            titlesList={this.props.titlesList}
            titleData={this.props.titleData} 
        />)
        
        
    }
}


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
        const url = `${baseImageURL}${posterSize}${this.props.posterPath}`
        return (
            <div>
                <img src={url} alt={noimageImageUrl} />
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


class CreateTitle extends React.Component {
    render() {
        const data = this.props.data
        return (
            <p id={data.id}>{data.original_title}</p>
              
        )
    }
}


class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: 5
        }
        this.handlePageClick = this.handlePageClick.bind(this)
    }

    handlePageClick(e) {
        const node = e.target.closest('p');
    
        if (!node) {
            return;
          }
    
         const center = Number(e.target.innerHTML);

        this.setState({center})
        e.target.classList.add('ClickedPage');
        this.props.onPageClick();
    }
    render() {
        const list = [];
        let offsetIndex = 4;
        let center = this.state.center;
        const lastPage = this.props.numOfPagesInList
        
        if (lastPage === 1) {
            return (<p hidden='true'>C</p>)
        }
        if(lastPage < 9) {
            for (let idx = 1; idx < lastPage; idx++ ){
                list.push(<Page num={idx} key={idx} />);
            }
            return (
                <div onClick={this.handlePageClick}>
                    {list}
                </div>
            )
        }

        if (center < 5) {
            center = 5;
        }

        if (center > lastPage - 3) {
            center = lastPage - 3;
        } 

        if(center > 5) {
            list.push(<Page num={1} key={1} />)
            list.push(<p className='page' key='after'>  </p>);
        }

        for (let idx = center - offsetIndex; idx < center + offsetIndex; idx++ ){
            list.push(<Page num={idx} key={idx} />);
        }

        if (center < lastPage - 3) {
            list.push(<p className='page' key='before'>  </p>);
            list.push(<Page num={lastPage} key={lastPage} />)
        }

        return (
            <div onClick={this.handlePageClick}>
                {list}
            </div>
        )
    }
} 

class Page extends React.Component {
    render() {
        return (
            <p id={this.props.num} className='page'>{this.props.num}</p>
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

export default App;