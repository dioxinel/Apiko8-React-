import React, { useState } from 'react';

function Pagination(props) {
    const [center, setCenter] = useState(5);

    function handlePageClick(e) {
        const node = e.target.closest('p');
    
        if (!node) {
            return;
          }
    
         const center = Number(e.target.innerHTML);

        setCenter(center);
        e.target.classList.add('ClickedPage');
        props.onPageClick();
    }

    
        const list = [];
        let offsetIndex = 4;
        let mid = center;
        const lastPage = props.numOfPagesInList

        if (lastPage === 1) {
            return (<p hidden={true}>C</p>)
        }
        if(lastPage < 9) {
            for (let idx = 1; idx < lastPage; idx++ ){
                list.push(<Page num={idx} key={idx} />);
            }
            return (
                <div onClick={handlePageClick}>
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
            list.push(<Page num={1} key={1} />)
            list.push(<p className='page' key='after'>  </p>);
        }

        for (let idx = mid - offsetIndex; idx < mid + offsetIndex; idx++ ){
            list.push(<Page num={idx} key={idx} />);
        }

        if (mid < lastPage - 3) {
            list.push(<p className='page' key='before'>  </p>);
            list.push(<Page num={lastPage} key={lastPage} />)
        }

        return (
            <div onClick={handlePageClick}>
                {list}
            </div>
        )
    
} 


function Page(props) {
    
    return (
        <p id={props.num} className='page'>{props.num}</p>
    )   
}

export default Pagination;