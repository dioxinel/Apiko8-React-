import React, { Fragment } from 'react';
//import './App.css';

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
    }


    render() {
        return (
            <Fragment>
                <input onChange={this.handleInputChange} placeholder='Search...'></input>
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
            titlesList: [],
            outputState: true
        }
        this.handleTitleClick = this.handleTitleClick.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }


    handleButtonClick(searchText) {
        let url;
        if (!searchText) {
            url = `${baseURL}trending/movie/week?api_key=${APIKEY}`
          }else{
           url = `${baseURL}search/movie?api_key=${APIKEY}&query=${searchText}`
          }

        fetch(url)
        .then(result=>result.json())
        .then((data) => {
            this.setState({
                titlesList: data.results, 
                outputState: true
            })
        })
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
                    onTitleClick={this.handleTitleClick}
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
        const node = e.target.closest('li');

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
            titlesList.map((title) => {
                return titles.push(<CreateTitle
                    data={title}
                    key={title.id}
                    onTitleClick={this.handleTitleClick}
                />);
            })
            return (
                <div> 
                    <table onClick={this.handleTitleClick}>
                       <tbody>{titles}</tbody>
                    </table>
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
        const node = e.target.closest('li');
    
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
                <table onClick={this.handleTitleClick}>
                    <tbody>{titles}</tbody>
                </table>
            </div>
        )
    }
}



class CreateTitle extends React.Component {
    render() {
        const data = this.props.data
        return (
            <tr>
                <th>
                    <li id={data.id}>{data.original_title}</li>
                </th>
            </tr>
        )
    }
}


export default App;