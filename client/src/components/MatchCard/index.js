
import React, { useContext, useEffect, useState } from "react";
import { Button, CollectionItem, Modal, Row, Col } from 'react-materialize';
import "./style.css"
import chatContext from "../../utils/chatContext"
import API from "../../utils/API";

const MatchCard = (props) => {
    const itemIds = {
        matchId: props.matchData.matchId
    }
    const { setChat, chatId } = useContext(chatContext)
    const [ currentChatStyle, setCurrentChatStyle ] = useState(false)
    const [ userRating, setUserRating ] = useState(0)
    const [ openInfoModal, setOpenInfoModal ] = useState(false)

    useEffect(() => {
       setChat({matchId: props.allMatches.data[0]._id})
       API.getUser(props.matchData.otherUser).then((res) => {
           if (res.data[0].rating.length === 0) {
               setUserRating(0)
           }
           else {
               let ratingCount = 0
               for (let i = 0; i < res.data[0].rating.length; i++) {
                   ratingCount = ratingCount + res.data[0].rating[i]
               }
               setUserRating(Math.round(ratingCount / res.data[0].rating.length))
           }
       })
    }, [])

    useEffect(() => {
        if (chatId.matchId === props.matchData.matchId) {
            setCurrentChatStyle(true)
        }
        else {
            setCurrentChatStyle(false)
        }
    }, [chatId])

    function activateInfoModal() {
        setOpenInfoModal(true)
        console.log(props.matchData)
    }

    function closeInfoModal() {
        setOpenInfoModal(false)
    }

    return (
        <div>
            {/* highlights currently selected chat */}
            {currentChatStyle ? (
                <CollectionItem className="avatar valign-wrapper" style={{backgroundColor:"#D3EEE3"}}>
                <a className="noHover"><img
                    alt=""
                    className="circle userItemPicture"
                    src={props.yourImageUrl}
                /></a>
                <img src="./../../img/swapO-logo-vector.png" className="swapSymbol noHover"></img>
                <a className="noHover"><img
                    alt=""
                    className="circle itemPicture noHover"
                    src={props.imageURL}
                /><i className="material-icons ratingStar noHover">star</i><p className="ratingNumber noHover">{userRating}</p></a>

                <a className="secondary-content">
                    <a className="btn-floating btn-large infoButton" style= {{backgroundColor:"#F28705"}} onClick={() => {activateInfoModal()}} ><i className="material-icons">info</i></a>
                </a>

                <a className="secondary-content">
                    {props.matchData.newText ? (<a className="btn-floating btn-large chatButton pulse" style= {{backgroundColor:"#F28705"}} onClick={() => {setChat(itemIds)}} ><i className="material-icons">chat</i></a>) : (<a className="btn-floating btn-large chatButton" style= {{backgroundColor:"#F28705"}} onClick={() => {setChat(itemIds)}} ><i className="material-icons">chat</i></a>)}
                    
                </a>
            </CollectionItem>
            ) : (
                <CollectionItem className="avatar valign-wrapper">
                <a className="noHover"><img
                    alt=""
                    className="circle userItemPicture "
                    src={props.yourImageUrl}
                /></a>
                <img src="./../../img/swapO-logo-vector.png" className="swapSymbol noHover"></img>
                <a className="noHover"><img
                    alt=""
                    className="circle itemPicture noHover"
                    src={props.imageURL}
                /><i className="material-icons ratingStar noHover">star</i><p className="ratingNumber">{userRating}</p></a>

                <a className="secondary-content">
                    <a className="btn-floating btn-large infoButton" style= {{backgroundColor:"#F28705"}} onClick={() => {activateInfoModal()}} ><i className="material-icons">info</i></a>
                </a>
                <a className="secondary-content">
                    {props.matchData.newText ? (<a className="btn-floating btn-large chatButton pulse" style= {{backgroundColor:"#F28705"}} onClick={() => {setChat(itemIds)}} ><i className="material-icons">chat</i></a>) : (<a className="btn-floating btn-large chatButton" style= {{backgroundColor:"#F28705"}} onClick={() => {setChat(itemIds)}} ><i className="material-icons">chat</i></a>)}
                    
                </a>
            </CollectionItem>
            )}
            <Modal
                open={openInfoModal}
                className='center-align'
                actions={[]}
                options={{
                    onCloseStart: closeInfoModal
                }}
                >
                <Row>
                    <Col s={12} m={4}>
                        <img src={props.matchData.userItemPhoto} className="circle modalUserImage"></img>
                        <h5>{props.matchData.userItemName}</h5>
                    </Col>
                    <Col s={12} m={4}>
                        <br></br><br></br>
                        <img src="./../../img/swapO-logo-vector.png" className="swapItemIcon"></img>
                        <br></br><br></br>
                    </Col>
                    <Col s={12} m={4}>
                        <img src={props.matchData.otherItemImage} className="circle modalUserImage"></img>
                        <h5>{props.matchData.otherItemName}</h5>
                    </Col>
                </Row>
                {/* <Row>
                    <Col s={6}>
                    <h5>{props.matchData.userItemName}</h5>
                    </Col>
                    <Col s={6}>
                    <h5>{props.matchData.otherItemName}</h5>
                    </Col>
                </Row> */}
                <a><Button modal="close" className="closeModalButton" onClick={closeInfoModal}>Close</Button></a>
            </Modal>

        </div>
    )
}
export default MatchCard;