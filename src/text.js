import React from 'react';
import './App.css';
import T from 'prop-types';

export const TextC = ({value, className, ...props}) => {
    return (
    <p 
    className={className}
    {...props} 
    >{value}</p>
    )
}

TextC.protoTypes = {
    value: T.string.isRequired,
    className: T.string
}

TextC.defaultProps = {
    className: "defaultText"
}