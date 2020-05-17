import React from 'react';
// @ts-ignore
import Dimensions from 'react-dimensions';

const DimensionsProvider = (props: any) => {
    return (
        <div>
            {props.children({
                containerWidth: props.containerWidth,
                containerHeight: props.containerHeight,
            })}
        </div>
    );
}

export default Dimensions()(DimensionsProvider);
