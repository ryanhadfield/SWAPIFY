import React, { useState, useEffect, useContext } from "react";
import API from "../../utils/API";
import { Collection, SideNav, Modal, Button } from 'react-materialize';
import MatchCard from '../MatchCard'
import { firestore } from "../../utils/firebase"
import chatContext from "../../utils/chatContext"
import "./style.css"


export default function MatchesSideBar(props) {
    const [usersItemList, setUsersItemList] = useState([]);
    const [matchList, setMatchList] = useState([])
    const [allMatches, setAllMatches] = useState([])
    const [noChats, setNoChats] = useState(false)
    const userData = props.userData
    const { recentText } = useContext(chatContext)
    let matchArray = []

    useEffect(() => {
        API.getUserItems(userData.googleId).then((response) => {
            setUsersItemList(response.data)
        })
        API.getUserMatches(userData.googleId).then((matchResponse) => {
            if (matchResponse.data.length === 0) {
                setNoChats(true)
            }
            setAllMatches(matchResponse)
            matchResponse.data.forEach(item => {
                if (item.item1Owner === userData.googleId) {
                    const itemInfo = {
                        userItemId: item.item1Id,
                        userId: item.item1Owner,
                        userItemPhoto: item.item1Photo,
                        userItemName: item.item1Name,
                        otherItemId: item.item2Id,
                        otherUser: item.item2Owner,
                        otherItemImage: item.item2Photo,
                        otherItemName: item.item2Name,
                        matchId: item._id,
                        newText: item.item1NewText
                    }
                    matchArray.push(itemInfo)
                    if (matchResponse.data.length === matchArray.length) {
                        getCollectionsMostRecents(matchArray).then((res) => {
                            setMatchList(res)
                        })
                    }
                }
                else {
                    const itemInfo = {
                        userItemId: item.item2Id,
                        userId: item.item2Owner,
                        userItemPhoto: item.item2Photo,
                        userItemName: item.item2Name,
                        otherItemId: item.item1Id,
                        otherUser: item.item1Owner,
                        otherItemImage: item.item1Photo,
                        otherItemName: item.item1Name,
                        matchId: item._id,
                        newText: item.item2NewText
                    }
                    matchArray.push(itemInfo)
                    if (matchResponse.data.length === matchArray.length) {
                        getCollectionsMostRecents(matchArray).then((res) => {
                            setMatchList(res)
                        })
                    }
                }
            });
        })
    }, [recentText, props])

    

    const getCollectionsMostRecents = async(newArray) => {
        if (newArray) {
        for (let i = 0; i < newArray.length; i++) {
            const returns = await firestore.collection(`${newArray[i].matchId}`).orderBy("createdAt", 'desc').limit(1).get()
            if (returns._delegate._snapshot.docChanges[0]) {
                newArray[i].latestText = returns._delegate._snapshot.docChanges[0].doc.data.partialValue.mapValue.fields.text.stringValue
                newArray[i].textTime = returns._delegate._snapshot.docChanges[0].doc.data.partialValue.mapValue.fields.createdAt.timestampValue
            }
        }
        let sortedList =  newArray.sort(function compare(a, b) {
            var dateA = new Date(a.textTime);
            var dateB = new Date(b.textTime);
            return dateB - dateA;
        });
        return sortedList
        }
    }

    useEffect(() => {
        
        getCollectionsMostRecents(matchList).then((res) => {
            setMatchList(res)
        })

    }, [recentText])
    


    return (
        <div>
            <SideNav
                fixed={true}
                trigger={<Button floating={true} large={true} className="chatSideNavTrigger"><i class="material-icons">chat</i></Button>}>
                <Collection className="chatCollection">
                    {matchList.map(match => (
                        <MatchCard yourImageUrl={match.userItemPhoto} imageURL={match.otherItemImage} matchData={match} allMatches={allMatches}/>
                    ))}
                </Collection>
            </SideNav>

            {/* No chats Modal */}
            <Modal
                open={noChats}
                className='center-align'
                actions={[]}
                options={{
                dismissible: false
                }}>
                <h3>No Chats!</h3>
                <br></br>
                <div>You don't have any open chats or matches!</div>
                <div>Go make some matches first!</div>
                <br></br>
                <a href={`/profile/${userData.googleId}`}><Button id="modalBtn">Go Back</Button></a>
            </Modal>
        </div>       
    )
}
