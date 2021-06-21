import React from 'react';
import Slider, { SliderTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import "./style.css"


function DistanceSlider(distance) {
    const { Handle } = Slider;

    const marks = {
        0: <strong>0 <br></br>Miles</strong>,
        50: <strong>50 Miles</strong>
    }

    const handle = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <SliderTooltip
        prefixCls="rc-slider-tooltip"
        overlay={`${value} Miles`}
        visible={dragging}
        placement="top"
        key={index}
        >
        <Handle value={value} {...restProps} />
        </SliderTooltip>
    );
    };

    return (  
    <div>
        <div className="center-align">
        <Slider min={0} max={50} className="distanceSlider" defaultValue={distance.distanceBoundary} handle={handle} marks={marks} onAfterChange={(e) => distance.setDistanceBoundary(e)}/>
        </div>
    </div>
    );
}

export default DistanceSlider