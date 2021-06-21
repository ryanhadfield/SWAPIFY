import React, {useState, useEffect } from "react";
import { useParams } from 'react-router-dom'
import { Col, Row} from 'react-materialize';
import MatchesSideBar from "../components/MatchesSideBar"
import ChatRoom from "../components/ChatRoom"
import API from "../utils/API"
import chatContext from "../utils/chatContext";


function ChatApp() {

    const [chatId, setChatId] = useState('empty')
    const [recentText, setRecentText] = useState('')
    const [notNewText, setNotNewText] = useState(2)
    const [userData, setUserData] = useState({email: "",
        firstName: "",
        googleId: "",
        image: "",
        lastName: "",
        listedItems: [],
        rating: []}
    )
    const { id } = useParams()

    useEffect(() => {
        API.getUser(id).then((res) => {
            const newUser = {
                email: res.data[0].email,
                firstName: res.data[0].firstName,
                googleId: res.data[0].googleId,
                image: res.data[0].image,
                lastName: res.data[0].lastName,
                listedItems: res.data[0].listedItems,
                rating: res.data[0].rating
            }
            setUserData(newUser)
        })
    }, [])

    function setChat(id) {
        setChatId(id)
        API.getMatch(id.matchId).then((res) => {
            if ((userData.googleId === res.data.item1Owner) && (res.data.item1NewText === true)) {
                const matchData = {
                    item1NewText: false
                }
                API.updateUserMatch(id.matchId, matchData)
                setNotNewText(Math.floor(Math.random() * 100000))
            }
            else if ((userData.googleId === res.data.item2Owner) && (res.data.item2NewText === true)) {
                const matchData = {
                    item2NewText: false
                }
                API.updateUserMatch(id.matchId, matchData)
                setNotNewText(Math.floor(Math.random() * 100000))
            }
        })
    }

    function setNewText(text) {
        setRecentText(text)
    }

    return (
        <div style={{minHeight: "95vh"}}>
        <chatContext.Provider value={{chatId, recentText, setChat, setNewText }}>
            <Row style={{marginBottom:"0px"}}>
                <Col s={0} m={4}>
                    <MatchesSideBar newText={notNewText} userData={userData}/>
                </Col>
                <Col s={12} m={8}>
                    <ChatRoom userData={userData}/>
                </Col>
            </Row>
        </chatContext.Provider>
        </div>
    )

}

export default ChatApp;