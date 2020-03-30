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
        let pageNum = document.querySelectorAll('.ClickedPage')[0].id;
        let searchText;
        try {
            searchText = document.getElementById('userFilter').innerHTML.slice(17);
        } catch {
            searchText = '';
        }
        this.handleButtonClick(searchText, pageNum)
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
        fetch(url)
            .then(result=>result.json())
            .then((titlesList)=>{
                this.setState({
                    titleData,
                    titlesList: titlesList.results,
                    outputState: false,
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

        this.handlePageClick = this.handlePageClick.bind(this)
    }

    handlePageClick(e) {
        const node = e.target.closest('p');
    
        if (!node) {
            return;
          }

        e.target.classList.add('ClickedPage');
        this.props.onPageClick();
    }
    render() {
        const list = [];
        let pageToRender;
        if (this.props.numOfPagesInList > 10) {
            pageToRender = 10;
        } else {
            pageToRender = this.props.numOfPagesInList;
        }
        for (let idx = 0; idx < pageToRender; idx++ ){
            list.push(<Page num={idx} key={idx} />);
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
            <p id={this.props.num + 1} className='page'>{this.props.num + 1}</p>
        )
    }
}
export default App;