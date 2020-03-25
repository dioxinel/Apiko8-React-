import React, { Fragment } from 'react';
//import './App.css';


const baseURL = 'https://api.themoviedb.org/3/';
const APIKEY = '21f53b102f9fcc68f706abfc92770539';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleData: {},
            data: {},
            outputState: true, // If true return list of titles, if false return title discription
        }
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleTitleClick = this.handleTitleClick.bind(this);
    }

    handleButtonClick(searchText) {
        let link;
        if (!searchText) {
            link = "".concat(baseURL, "trending/movie/week?api_key=", APIKEY);
          }else{
           link = "".concat(baseURL, "search/movie?api_key=", APIKEY,"&query=", searchText);
          }
        fetch(link)
        .then(result=>result.json())
        .then((data) => {this.setState({data: data, outputState: true})})
    }

    handleTitleClick(titleData) {
        this.setState({outputState: false, titleData: titleData})
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
                outputState={this.state.outputState}
                data={this.state.data}
                titleData={this.state.titleData}
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
        let rows = [];
        for (let movie in data.results) {
            rows.push(<CreateTitle
                 movie={movie}
                 data={data}
                 key={movie}
                 onTitleClick={this.props.onTitleClick}
                  />);}
        return (
            <div> 
                <table>
                    <tbody>{rows}</tbody>
                </table>
            </div>
                )
    } else {
          return (<TitleDiscription 
            titleData={this.props.titleData}
            data={this.props.data}  />)
      }
    }
}

class TitleDiscription extends React.Component {   
    render() {
        const dataName = this.props.data.results[this.props.titleData].original_title;
        return (
            <div> 
               {dataName} 
            </div>
        )
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
        const dataName = this.props.data.results[this.props.movie].original_title;
        const numInList = Number(this.props.movie) + 1;
        return (
            <tr>
                <th 
                colSpan='2'  
                onClick={this.handleTitleClick}>
                    {numInList + ')' + dataName}
                </th>
            </tr>
        )
    }
}



export default App;
