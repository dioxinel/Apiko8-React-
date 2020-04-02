import React, { Fragment } from 'react';
import './App.css';
import TitleDiscription from './TitleDiscription';
import Pagination from './Pagination';

const baseURL = 'https://api.themoviedb.org/3/';
const APIKEY = '21f53b102f9fcc68f706abfc92770539';


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
            startUrl: `${baseURL}trending/movie/week?api_key=${APIKEY}&language=en-US&page=`
        }

        this.handleStartPageClick = this.handleStartPageClick.bind(this);
    }

    handleStartPageClick(e) {
        const node = e.target.closest('button');

        if (!node) {
            return;
        }
        let startUrl;
        if (e.target.innerHTML === 'Trending') {
            startUrl = `${baseURL}trending/movie/week?api_key=${APIKEY}&language=en-US&page=`;
        } else if (e.target.innerHTML === 'Top Rated') {
            startUrl = `${baseURL}movie/top_rated?api_key=${APIKEY}&language=en-US&page=`;
        } else {
            startUrl = `${baseURL}movie/popular?api_key=${APIKEY}&language=en-US&page=`;
        }
        this.setState({startUrl})
    }

    render() {
        const startUrl = this.state.startUrl;

        return(
            <div onClick={this.handleStartPageClick}>
                <button>Trending</button>
                <button>Top Rated</button>
                <button>Popular</button>
                <Output startUrl={startUrl}/>
            </div>
        )
    }
}


class Output extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleData: [],
            titlesList: [], // At start page contains main titles list, in title discription contains recomendation list
            outputState: true,  // If true return list of titles, if false return title discription
            numOfPagesInList: '',
            startUrl: '',
        }
        this.handleTitleClick = this.handleTitleClick.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }


    handleButtonClick(searchText, pageNum = 1) {
        let url;
        if (!searchText) {
            url = `${this.props.startUrl}${pageNum}`
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
                searchText: searchText,
                startUrl: this.props.startUrl
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
        if(this.state.startUrl !== this.props.startUrl) {
            this.handleButtonClick()
        }
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


class CreateTitle extends React.Component {
    render() {
        const data = this.props.data
        return (
            <p id={data.id}>{data.original_title}</p>
              
        )
    }
}

export { App, CreateTitle};
