import React from 'react';

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            center: 5
        }
        this.handlePageClick = this.handlePageClick.bind(this)
    }


    handlePageClick(e) {
        const node = e.target.closest('p');
    
        if (!node) {
            return;
          }
    
         const center = Number(e.target.innerHTML);

        this.setState({center})
        e.target.classList.add('ClickedPage');
        this.props.onPageClick();
    }

    render() {
        const list = [];
        let offsetIndex = 4;
        let center = this.state.center;
        const lastPage = this.props.numOfPagesInList

        if (lastPage === 1) {
            return (<p hidden={true}>C</p>)
        }
        if(lastPage < 9) {
            for (let idx = 1; idx < lastPage; idx++ ){
                list.push(<Page num={idx} key={idx} />);
            }
            return (
                <div onClick={this.handlePageClick}>
                    {list}
                </div>
            )
        }

        if (center < 5) {
            center = 5;
        }

        if (center > lastPage - 3) {
            center = lastPage - 3;
        } 

        if(center > 5) {
            list.push(<Page num={1} key={1} />)
            list.push(<p className='page' key='after'>  </p>);
        }

        for (let idx = center - offsetIndex; idx < center + offsetIndex; idx++ ){
            list.push(<Page num={idx} key={idx} />);
        }

        if (center < lastPage - 3) {
            list.push(<p className='page' key='before'>  </p>);
            list.push(<Page num={lastPage} key={lastPage} />)
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
            <p id={this.props.num} className='page'>{this.props.num}</p>
        )
    }
}

export default Pagination;