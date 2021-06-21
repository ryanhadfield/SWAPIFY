import React from 'react'
import "./style.css"


export default function SwipingCard(props) {
    return (
        <div class="card swipCard center-align">
            <div class="card-image swipCard center-align">
                <img className="cardImage center-align" draggable="false"src={props.itemInfo.imageURL} alt="swip card" />
            </div>
            <div class="card-content">
                <span class="card-title">{props.itemInfo.itemName}</span>
                <div>{props.itemInfo.itemDescription}</div>
            </div>  
        </div>
    )
}
