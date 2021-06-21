import React, { useState, useRef, useEffect, useContext } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Col, Row, Button, Modal } from 'react-materialize';
import API from '../../utils/API'
import { firebase, firestore } from "../../utils/firebase"
import ChatMessage from "../ChatMessage"
import chatContext from "../../utils/chatContext"
import Confetti from "react-dom-confetti";
import "./style.css"
import Rating from 'react-rating'

export default function ChatRoom(props) {
    const userData = props.userData
    const { chatId, setNewText } = useContext(chatContext)
    const [messagesRef, setMessagesRef] = useState(firestore.collection('empty'))
    const query = messagesRef.orderBy('createdAt')
    const [messages] = useCollectionData(query, {idField: 'id'})
    const [formValue, setFormValue] = useState('')
    const dummy = useRef()
    const [userItem, setUserItem] = useState({})
    const [otherItem, setOtherItem] = useState({})
    const messagesEndRef = React.createRef()
    const [openRateModal, setOpenRateModal] = useState(false)
    const [rating, setRating] = useState(0)
    const [reward, setReward ] = useState(false)

    useEffect(() => {
        setMessagesRef(firestore.collection(chatId.matchId || 'empty'))
        API.getMatch(chatId.matchId).then((matchResponse) => {
            if (matchResponse.data.item1Owner === userData.googleId) {
                setUserItem({id: matchResponse.data.item1Owner, photoURL: matchResponse.data.item1Photo})
                setOtherItem({id: matchResponse.data.item2Owner, photoURL: matchResponse.data.item2Photo})
            }
            else {
                setUserItem({id: matchResponse.data.item2Owner, photoURL: matchResponse.data.item2Photo})
                setOtherItem({id: matchResponse.data.item1Owner, photoURL: matchResponse.data.item1Photo})
            }
        })
        setTimeout(function () {
            dummy.current.scrollIntoView({ behavior: 'smooth' })
          }, 500)
    }, [chatId])


    const sendMessage = async(e) => {
        e.preventDefault();
        API.getMatch(chatId.matchId).then((matchResponse) => {
            if (matchResponse.data.item1Owner === userData.googleId) {
                const matchData = {
                    item2NewText: true,
                    item1NewText: false
                }
                API.updateUserMatch(chatId.matchId, matchData)
            }
            else {
                const matchData = {
                    item1NewText: true,
                    item2NewText: false
                }
                API.updateUserMatch(chatId.matchId, matchData)
            }
        })


        setNewText(formValue)
        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            sentFromid: userItem.id,
            sentToid: otherItem.id,
            sentFromPhoto: userItem.photoURL,
            setToPhoto: otherItem.photoURL
        })
        setFormValue('')
        dummy.current.scrollIntoView({ behavior: 'smooth' })
    }

    function swapItems() {
        setReward(true)
        API.getMatch(chatId.matchId).then((matchResponse) => {
            console.log(matchResponse)
            if (matchResponse.data.item1Owner === userData.googleId) {
                API.deleteMatchesForItem(matchResponse.data.item1Id).then((res) => {
                    API.deleteItem(matchResponse.data.item1Id).then((delResponse) => {
                        API.updateItem(matchResponse.data.item2Id, {deleteItem: matchResponse.data.item1Owner}).then((updateRes) => {
                            setOpenRateModal(true)
                        })
                    })
                })
            }
            else {
                API.deleteMatchesForItem(matchResponse.data.item2Id).then((res) => {
                    API.deleteItem(matchResponse.data.item2Id).then((delResponse) => {
                        API.updateItem(matchResponse.data.item1Id, {deleteItem: matchResponse.data.item2Owner}).then((updateRes) => {
                            setOpenRateModal(true)
                        })
                    })
                })
            }
        })
    }

    function deleteMatch() {
        API.deleteMatch(chatId.matchId).then((res) => {
            setOpenRateModal(true)
        })
    }

    function reloadPage() {
        window.location.reload();
    }

    function submitRating() {
        API.getUser(otherItem.id).then((userResponse) => {
            const ratingArray = userResponse.data[0].rating
            ratingArray.push(rating)
            const newUserRating = {
                rating: ratingArray
            }
            API.updateUser(otherItem.id, newUserRating).then((res) => {
                window.location.reload();
            })
        })
    }

    return (
        <div>
        <div className="container">
            {/* Rate User */}
            <Modal
                open={openRateModal}
                className='center-align'
                actions={[]}
                options={{
                dismissible: false
                }}>
                <h3>Match Deleted!</h3>
                <br></br>
                <div>Would you like to rate the other user?</div>
                <br></br>
                <Rating
                    emptySymbol={<i className="material-icons">star_border</i>}
                    fullSymbol={<i className="material-icons">star</i>}
                    onChange={(e) => setRating(e)}
                ></Rating>
                <br></br><br></br>
                <a><Button onClick={submitRating} modal="close">Submit Rating</Button></a>
                <br></br><br></br>
                <a><Button onClick={reloadPage} modal="close">No Thanks</Button></a>
            </Modal>
            <Row className="wrapper">
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} userData={userData}/>)}
                <div ref={dummy}></div>
                <div ref={messagesEndRef} />
                <br></br><br></br><br></br><br></br><br></br>
            </Row>
        
        <div className="chatControls">
        <Confetti
                            id="confetti"
                            active={reward}
                            className="right-align"
                        />
            <Row>
                <Col s={12}>
                    <form onSubmit={sendMessage}>   
                        <Col s={10}>
                        <input value={formValue} required className="chatForm" onChange={(e) => setFormValue(e.target.value)}/>
                        </Col>
                        <Col s={2}>
                        <button type="submit" className="btn-floating btn-large waves-effect waves-light sendButton"><i className="material-icons">send</i></button>
                        </Col>
                    </form>
                </Col>
            </Row>
            <Row>
                <Col s={6} className='center-align'>
                    <Modal
                        className="center-align"
                        id="Modal-Swap"
                        trigger={<Button node="button" className="swapItemsButton">SWAP ITEMS</Button>}
                    >
                        <h3>Swap Items?</h3>
                        <br></br>
                        <div>If you press confirm your item will be no longer listed on Swapify. Only do this after swapping items.</div>
                        <br></br><br></br>
                        <a><Button onClick={swapItems} modal="close">Confirm</Button></a>
                    </Modal>
                </Col>
                <Col s={6} className='center-align'>
                    <Modal
                        className="center-align"
                        id="Modal-Swap"
                        trigger={<Button node="button" className="deleteMatchButton">DELETE MATCH</Button>}
                    >
                        <h3>Delete Match?</h3>
                        <br></br>
                        <div>If you press confirm your match will be deleted from Swapify.</div>
                        <br></br><br></br>
                        <a><Button onClick={deleteMatch} modal="close">Confirm</Button></a>
                    </Modal>
                </Col>
            </Row>
        </div>
        </div>
        </div>
    )
}
