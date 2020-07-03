import React, { Fragment } from 'react';
import './App.css';
import TitleDiscription from './TitleDiscription';
import Pagination from './Pagination';
import { useState } from 'react';

const baseURL = 'https://api.themoviedb.org/3/';
const APIKEY = '21f53b102f9fcc68f706abfc92770539';


function SearchBar(props) {
    const [searchText, setSearchText] = useState('');
    function handleInputChange(e) {
        setSearchText(e.target.value);
    }


    function handleButtonClick() {
        props.onButtonClick(searchText);
        setSearchText('');
        document.getElementById('searchInput').value = '';
    }

    return (
        <Fragment>
            <input id='searchInput' onChange={handleInputChange} placeholder='Search...'></input>
            <button onClick={handleButtonClick}>Search</button>
        </Fragment>
        )
    
}

function App(props) {
    const [startUrl, setStartUrl] = useState(`${baseURL}trending/movie/week?api_key=${APIKEY}&language=ru-RU&page=`);

    function handleStartPageClick(e) {
        const node = e.target.closest('button');

        if (!node) {
            return;
        }
        let startUrl;
        if (e.target.innerHTML === 'Trending') {
            startUrl = `${baseURL}trending/movie/week?api_key=${APIKEY}&language=ru-RU&page=`;
        } else if (e.target.innerHTML === 'Top Rated') {
            startUrl = `${baseURL}movie/top_rated?api_key=${APIKEY}&language=ru-RU&page=`;
        } else {
            startUrl = `${baseURL}movie/popular?api_key=${APIKEY}&language=ru-RU&page=`;
        }
        setStartUrl(startUrl);
    }

        return(
            <div onClick={handleStartPageClick}>
                <button>Trending</button>
                <button>Top Rated</button>
                <button>Popular</button>
                <Output startUrl={startUrl}/>
            </div>
        )
    }



function Output(props) {
    const [titleData, setTitleData] = useState([]);
    const [titlesList, setTitlesList] = useState([]);       // At start page contains main titles list, in title discription contains recomendation list
    const [outputState, setOutputState] = useState(true);   // If true return list of titles, if false return title discription
    const [numOfPagesInList, setNumOfPagesInList] = useState('');
    const [startUrl, setStartUrl] = useState('');
    const [searchText, setSearchText] = useState('');

    function handleButtonClick(searchText, pageNum = 1) {
        let url;
        if (!searchText) {
            url = `${props.startUrl}${pageNum}`
        } else {
            url = `${baseURL}search/movie?api_key=${APIKEY}&query=${searchText}&language=ru-RU&page=${pageNum}`
        }

        fetch(url)
        .then(result=>result.json())
        .then((data) => {
            setTitlesList(data.results); 
            setOutputState(true);
            setNumOfPagesInList(data.total_pages);
            setSearchText(searchText);
            setStartUrl(props.startUrl);
        })
    }


    function handlePageClick() {
        let page = document.querySelectorAll('.ClickedPage')[0];
        page.classList.remove('ClickedPage');
        let searchText;
        try {
            searchText = document.getElementById('userFilter').innerHTML.slice(17);
        } catch {
            searchText = '';
        }
        handleButtonClick(searchText, page.id);
    }



    function handleTitleClick() {
        const title = document.querySelectorAll('.Clicked')[0];
        title.classList.remove('.Clicked');
        let newTitleData;
        const newTitlesList = [...titlesList];
        for (let item in newTitlesList) {
            if (newTitlesList[item].id + '' === title.id) {
                newTitleData = newTitlesList[item];
                break;
            }
        }
        
        const url = `${baseURL}movie/${title.id}/recommendations?api_key=${APIKEY}&language=ru-RU&page=1`
        const videoUrl = `${baseURL}movie/${title.id}/videos?api_key=${APIKEY}&language=ru-RU`
        fetch(url)
            .then(result=>result.json())
            .then((newTitlesList)=>{
                fetch(videoUrl)
                    .then(result=>result.json())
                    .then((videoData)=>{
                        newTitleData.videoData = videoData;
                        setTitleData(newTitleData);
                        setTitlesList(newTitlesList.results);
                        setOutputState(false);
 
            })
        })      
    }


    if(startUrl !== props.startUrl) {
        handleButtonClick()
    }
    return(
        <Fragment>
            <SearchBar  
            onButtonClick={handleButtonClick} 
            />
            <OutputComponent
                titleData={titleData}
                titlesList={titlesList}
                outputState={outputState}
                numOfPagesInList={numOfPagesInList}
                onButtonClick={handleButtonClick}
                onPageClick={handlePageClick}
                onTitleClick={handleTitleClick}
                searchText={searchText}
                />
        </Fragment>
    )
}




function OutputComponent(props) {
    function handleTitleClick(e) {
        const node = e.target.closest('p');

        if (!node) {
            return;
          }
        e.target.classList.add('Clicked');
        props.onTitleClick();
    }
    
    if (props.outputState) {
        const titlesList = props.titlesList;
        const titles = [];
        if (props.searchText) {
        titles.push(<h3 id='userFilter' key={'Uniqe'}>{'You looking for: ' + props.searchText}</h3>)
        } 
        titlesList.map((title) => {
            return titles.push(<CreateTitle
                data={title}
                key={title.id}
                onTitleClick={handleTitleClick}
            />);
        })
        return (
            <div> 
                <div onClick={handleTitleClick}>
                    {titles}
                </div>
                    
                <Pagination 
                    numOfPagesInList={props.numOfPagesInList}
                    onPageClick={props.onPageClick}
                    />
            </div>
        )
    }

    return (<TitleDiscription 
        onTitleClick={props.onTitleClick}
        titlesList={props.titlesList}
        titleData={props.titleData} 
    />)      
}



function CreateTitle(props) {
    
    const data = props.data
    return (
        <p id={data.id}>{data.original_title}</p>        
    )
}

export { App, CreateTitle};
