import React, { Fragment } from 'react';
//import './App.css';

const noimageImageUrl = 'https://748073e22e8db794416a-cc51ef6b37841580002827d4d94d19b6.ssl.cf3.rackcdn.com/not-found.png';
const baseURL = 'https://api.themoviedb.org/3/';
const APIKEY = '21f53b102f9fcc68f706abfc92770539';
const baseImageURL = "https://image.tmdb.org/t/p/";
const posterSize = 'w300';
let buffer = {}; // buffer, by which recomendData transfer to data when user click on title in recomendations


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recomendData: {},
            titleNum: '',
            data: {},
            outputState: true, // If true return list of titles, if false return title discription
        }

        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleTitleClick = this.handleTitleClick.bind(this);
    }


    handleButtonClick(searchText) {
        let link;

        if (!searchText) {
            link = "".concat(baseURL, 
                            "trending/movie/week?api_key=", 
                            APIKEY);
          }else{
           link = "".concat(baseURL, 
                            "search/movie?api_key=", 
                            APIKEY,
                            "&query=", 
                            searchText);
          }

        fetch(link)
        .then(result=>result.json())
        .then((data) => {this.setState({data: data, outputState: true})})
    }


    handleTitleClick(titleNum) {
        let link;

        if(this.state.outputState) {
            link = "".concat(baseURL,
                             "movie/", 
                             this.state.data.results[titleNum].id, 
                             "/recommendations?api_key=", 
                             APIKEY, 
                             "&language=en-US&page=1");
        } else { 
            link = "".concat(baseURL, 
                            "movie/", 
                            this.state.recomendData.results[titleNum].id, 
                            "/recommendations?api_key=", 
                            APIKEY, 
                            "&language=en-US&page=1");
        }

        fetch(link)
            .then(result=>result.json())
            .then((recomendData)=>{
                if(!this.state.outputState) {
                    this.setState({
                        data: buffer 
                    })
                }

                this.setState({
                    outputState: false,
                    titleNum: titleNum,
                    recomendData: recomendData,
                    })  
            })      
    }


    componentDidMount() {
        this.handleButtonClick();
    }


    render() {
        buffer = this.state.recomendData;
        
        return(
            <Fragment>
                <SearchBar  
                onButtonClick={this.handleButtonClick} 
                />
                <OutputComponent 
                outputState={this.state.outputState}
                data={this.state.data}
                recomendData={this.state.recomendData}
                titleNum={this.state.titleNum}
                onTitleClick={this.handleTitleClick}
                 />
            </Fragment>
        )
    }
}


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


class OutputComponent extends React.Component {
    render() {
        if (this.props.outputState) {
            const data = this.props.data;
            let titles = [];

            for (let titleNum in data.results) {
                titles.push(<CreateTitle
                    titleNum={titleNum}
                    data={data}
                    key={titleNum}
                    onTitleClick={this.props.onTitleClick}
                />);
            }
            return (
                <div> 
                    <table>
                        <tbody>{titles}</tbody>
                    </table>
                </div>
            )
        } else {
            return (<TitleDiscription 
                titleNum={this.props.titleNum}
                onTitleClick={this.props.onTitleClick}
                data={this.props.data}
                recomendData={this.props.recomendData}  
            />)
        }
    }
}


class CreateTitle extends React.Component {
    constructor(props) {
        super(props);

        this.handleTitleClick = this.handleTitleClick.bind(this)
    }


    handleTitleClick(e) {
        this.props.onTitleClick(e.target.innerHTML[0] - 1);
    }


    render() {
        const dataName = this.props.data.results[this.props.titleNum].original_title;
        const numInList = Number(this.props.titleNum) + 1;

        return (
            <tr>
                <th onClick={this.handleTitleClick}>
                    {numInList + ')' + dataName}
                </th>
            </tr>
        )
    }
}


class TitleDiscription extends React.Component { 
    render() {
        const data = this.props.data.results[this.props.titleNum];

        return (
            <div>
                <TitlePoster posterPath={data.poster_path} />
               <h1>{data.original_title}</h1>
               <TitleOverview dataOverview={data.overview} />
               <TitleRecomendations 
               recomendData={this.props.recomendData}
               onTitleClick={this.props.onTitleClick} 
               />
            </div>
        )
    }
}


class TitlePoster extends React.Component {
    render() {
        const link = "".concat(baseImageURL, posterSize, this.props.posterPath); 
        return (
            <div>
                <img src={link} alt={noimageImageUrl} />
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
    render() {
        const titles = [];
        let numOfRecomendations = 5;

        for (let titleNum in this.props.recomendData.results) {
            numOfRecomendations--;
            titles.push(<CreateTitle
                titleNum={titleNum}
                data={this.props.recomendData}
                key={titleNum}
                onTitleClick={this.props.onTitleClick}
                />);

            if(numOfRecomendations === 0) {
                break;
            }
        }
        return (
            <div>
                <h3>Recomendations</h3>
                <table>
                    <tbody>{titles}</tbody>
                </table>
            </div>
        )
    }
}


export default App;
