import React from 'react';
import T from 'prop-types';
import './App.css';

export const PaginNode = ({ num }) => {
    return (
        <p id={num} className={'paginNode'}>{num}</p>
    )
}

PaginNode.protoTypes = {
    num: T.number.isRequired
}