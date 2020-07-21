import React from 'react';
import './App.css';
import { useState } from 'react';
import T from 'prop-types';

import { PaginNode } from './paginNode';

export const Pagination = ({ countPagesInList, searchText, fetchData }) => {
    const [center, setCenter] = useState(5);

    const handlePaginClick = (e) => {
        const node = e.target.closest('p');
    
        if (!node) {
            return;
        }
        
        const center = Number(e.target.innerHTML);

        setCenter(center);
        fetchData(searchText, center);
    }

    const list = [];
    let offsetIndex = 4;
    let mid = center;
    const lastPage = countPagesInList;

    if (lastPage === 1) {
        return (<p hidden={true}>C</p>)
    }

    if(lastPage < 9) {
        for (let idx = 1; idx < lastPage; idx++ ){
            list.push(<PaginNode num={idx} key={idx} />);
        }
        return (
            <div onClick={handlePaginClick}>
                {list}
            </div>
        )
    }

    if (mid < 5) {
        mid = 5;
    }

    if (mid > lastPage - 3) {
        mid = lastPage - 3;
    } 

    if(mid > 5) {
        list.push(<PaginNode num={1} key={1} />)
        list.push(<p key='after'>  </p>);
    }

    for (let idx = mid - offsetIndex; idx < mid + offsetIndex; idx++ ){
        list.push(<PaginNode num={idx} key={idx} />);
    }

    if (mid < lastPage - 3) {
        list.push(<p key='before'>  </p>);
        list.push(<PaginNode num={lastPage} key={lastPage} />)
    }

    return (
        <div onClick={handlePaginClick} className={'pagination'}>

            {list}
        </div>
    )
}

Pagination.protoTypes = {
    countPagesInList: T.number.isRequired,
    searchText: T.string,
    fetchData: T.func
}