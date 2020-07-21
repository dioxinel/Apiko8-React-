import './App.css';
import React, { useState, useEffect } from 'react';

import { TitlesList } from './titlesList';
import { Header } from './header'
import { TitleDiscription } from './TitleDiscription/titleDiscription';
import { Pagination } from './pagination';

const baseURL = 'https://api.themoviedb.org/3/';
const APIKEY = '21f53b102f9fcc68f706abfc92770539';
const startUrl = `${baseURL}trending/movie/week?api_key=${APIKEY}&language=ru-RU&page=`;
let firstLoad = true;


export const Page = () => {
  const [searchText, setSearchText] = useState('');
  const [titlesList, setTitlesList] = useState([]);
  const [pageState, setPageState] = useState(true);
  const [titleData, setTitleData] = useState({});
  const [prevData, setPrevData] = useState({});

  useEffect(() => {
    if (firstLoad) {
      fetchData()
      firstLoad = false;
    }
  });

  const handlePrevPage = () => {
    setTitlesList(prevData.titlesList);
    setPageState(prevData.pageState);
    if (!prevData.pageState) {
      setTitleData(prevData.titleData);
    }
    setPrevData(prevData.prevData);

  }  
  

  const handleInputChange = (e) => {
      setSearchText(e.target.value);
      setPageState(true);
      fetchData(e.target.value);     
  }

  const fetchData = (searchText, pageNum = 1) => {
    let url;
    if (!searchText) {
      url = `${startUrl}${pageNum}`
    } else {
      url = `${baseURL}search/movie?api_key=${APIKEY}&query=${searchText}&language=ru-RU&page=${pageNum}`
    }
    fetch(url)
      .then(result=>result.json())
      .then((data) => {
        const newPrevData = { ...prevData };
        newPrevData.titlesList = titlesList;
        setPrevData(newPrevData);
        setTitlesList(data); 
      })
  }

  const handleTitleClick = (id) => {
    let newTitleData;
    for (let item in titlesList.results) {
      if (titlesList.results[item].id + '' === id) {
        newTitleData = titlesList.results[item];
        break;
      }
    }
    
    const recommendUrl = `${baseURL}movie/${id}/recommendations?api_key=${APIKEY}&language=ru-RU&page=1`;
    const videoUrl = `${baseURL}movie/${id}/videos?api_key=${APIKEY}&language=ru-RU`;
    fetch(recommendUrl)
      .then(result=>result.json())
      .then((recommendations)=>{
        newTitleData.recommendations = recommendations;
        fetch(videoUrl)
          .then(result=>result.json())
          .then((videoData)=>{
            newTitleData.videoData = videoData;
            setPrevData({titlesList, titleData, pageState, prevData})
            setTitleData(newTitleData);
            setTitlesList(recommendations);
            setPageState(false);
            })
        })
  }

  if (pageState) {
    return (
      <div className={'page'}>
        <Header 
          handleInputChange={handleInputChange}
          pageState={pageState}
          className={'header'}/>
        <TitlesList 
          data={titlesList}
          searchText={searchText}
          onTitleClick={handleTitleClick}
          pageState={pageState}
          className={'titlesList'}
        />
        <Pagination 
          countPagesInList={titlesList.total_pages}
          searchText={searchText}
          fetchData={fetchData}
          />
      </div>
    )
  } else {
    return (
      <div className={'discription'}>
        <Header 
          handleInputChange={handleInputChange} 
          handlePrevPage={handlePrevPage}
          className={'header'}/>
        <TitleDiscription 
          titleData={titleData} 
          pageState={pageState}
          onTitleClick={handleTitleClick}/>
      </div>  
    )
  }
  
}



