import React from 'react';
import './App.css';
import T from 'prop-types';


import { Title } from './title';

export const TitlesList = ({ data, searchText, onTitleClick, pageState, className }) => {
    const titles = [];
    if(pageState) {
        if (data.total_results) {
            if (searchText) {
                titles.push(<h3 id='userFilter' className={'lookingFor'} key={'Uniqe'}>{'You looking for: ' + searchText}</h3>)
            }
            data.results.map((title) => {
                return titles.push(
                <Title data={title} 
                key={ title.id } 
                className={'Title'} 
                />); 
            })
        } else {
            titles.push(<h3 key={'notFound'}>Unfortunately, your search returned no results. Try another name of title</h3>)
        }
    } else {
        if (!data.total_results) {
            return (
                <div>
                    <h3>This title don't have recommendations</h3>
                </div>
            )
        }
        if (data.results) {
            for (let i = 0; i <= 4; i++) {
                titles.push(
                    <Title data={data.results[i]} 
                    key={ data.results[i].id } 
                    className={'Title'} 
                    />
                )
            }
        }
        
    }
    
    
    const handleTitleClick = (e) => {
        const node = e.target.closest('div');
        
        if (!node || !node.id) {
            return;
        }
        onTitleClick(node.id);
            
    }
    if (pageState) {
        return(
            <div className={className} onClick={handleTitleClick}>{titles}</div>   
        )
    }

  return (
    <div>
        <h3>Recommendations:</h3>
        <div>
            <div className={className} onClick={handleTitleClick}>{titles}</div>
        </div>
    </div>
)
}

TitlesList.protoTypes = {
    data: T.object.isRequired,
    pageState: T.bool.isRequired,
    onTitleClick: T.func.isRequired,
    searchText: T.string,
    className: T.string
}
