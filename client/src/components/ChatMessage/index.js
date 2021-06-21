import React from 'react'
import "./style.css"

export default function ChatMessage(props) {
    const userData = props.userData
    const { text, sentFromid, sentFromPhoto } = props.message;
    const messageClass = sentFromid === userData.googleId ? 'sent' : 'received';


    return (
        <div className={`message ${messageClass}`}>
            <img className='itemPhoto' src={sentFromPhoto} alt="photo of item"/>
            <p>{text}</p>
        </div>
    )
}
