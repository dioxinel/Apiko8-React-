import React from 'react';
import T from 'prop-types';
import './titleDiscription.css';

import { TitlesList } from '../titlesList';

export const Recommendations = ({ data, pageState, onTitleClick }) => {

    return (
        <div>
            <TitlesList 
                data={data}
                onTitleClick={onTitleClick}
                pageState={pageState}
                className={'recommendations'}
        />
        </div>
    )
}

Recommendations.protoTypes = {
    data: T.object.isRequired,
    pageState: T.bool.isRequired,
    onTitleClick: T.func.isRequired
}

Recommendations.defaultProps = {
    data: { results: false }
}