import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import Welcome from "./pages/welcome"
import Profile from "./pages/profile"
import Chat from "./pages/chat"
import createItem from "./pages/createItem"
import Swipping from "./pages/swipping"
import CustomNavbar from './components/Navbar';
import CustomFooter from './components/Footer';
import API from "./utils/API"
import { Button, Modal } from 'react-materialize';
import Rating from 'react-rating'
import "./appStyle.css"

function App() {
  const { pathname } = useLocation();
  const pathway = pathname.split("/")
  const id = pathway[pathway.length - 1]
  const [openSwapModal, setOpenSwapModal] = useState(false)
  const [openMatchModal, setOpenMatchModal] = useState(false)
  const [modalImage, setModalImage] = useState('');
  const [modalID, setModalID] = useState('')
  const [modalMatchImage1, setModalMatchImage1] = useState('')
  const [modalMatchImage2, setModalMatchImage2] = useState('')
  const [openRateModal, setOpenRateModal] = useState(false)
  const [rating, setRating] = useState(0)
  const [deletedItemUserId, setDeletedItemUserId] = useState('')
  const [backgroundClass, setBackgroundClass] = useState("welcomeBackground")
  
  
  setInterval(function () {
    if (id) {
      API.getUserItems(id).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].deleteItem !== 'false') {
            setDeletedItemUserId(response.data[i].deleteItem)
            setModalImage(response.data[i].imageURL)
            setModalID(response.data[i]._id)
            setOpenSwapModal(true)
          }
        }
      })
    }
  }, 5000)

  setInterval(function () {
    if (id) {
      API.getUserMatches(id).then((response) => {
          // checks if matches have been read or not by user2 (the user that was not swipping when the match was made)
          for (let i = 0; i < response.data.length; i++) {
              if ((response.data[i].item2Owner == id) && (response.data[i].item2Read === false)) {
                  const matchData = {
                      item2Read: true
                  }
                  API.updateUserMatch(response.data[i]._id, matchData).then((matchPutResponse) => {
                      setOpenMatchModal(true)
                      setModalMatchImage1(response.data[i].item1Photo)
                      setModalMatchImage2(response.data[i].item2Photo)
                  })
              }
          }
      })
    }
  }, 5000)

  function deleteItem() {
    API.deleteItem(modalID).then((res) => {
      setOpenRateModal(true)
    })
  }

  function keepItem() {
    const updatedItem = {
      deleteItem: false
    }
    API.updateItem(modalID, updatedItem).then((res) => {
      setOpenRateModal(true)
    })
  }

  function submitRating() {
    API.getUser(deletedItemUserId).then((res) => {
      console.log(res.data[0].rating)
      const ratingArray = res.data[0].rating
      ratingArray.push(rating)
      const newUserRating = {
          rating: ratingArray
      }
      API.updateUser(deletedItemUserId, newUserRating).then((res) => {
          window.location.reload();
      })
    })

  }

  useEffect(() => {
    if (pathname === "/") {
      setBackgroundClass("welcomeBackground")
    }
    else if (pathway[1] === "profile") {
      setBackgroundClass('profileBackground')
    }
    else if (pathway[1] === "chat") {
      setBackgroundClass("chatBackground")
    }
    else if (pathway[1] === "createItem") {
      setBackgroundClass('createItemBackground')
    }
    else if (pathway[1] === "swipping") {
      setBackgroundClass('swipingBackground')
    }
  }, [pathname])

  return (
    <div className={backgroundClass}>
      <CustomNavbar></CustomNavbar>
      <Route exact path="/" component={Welcome} />
      <Route path="/profile/:id" component={Profile} />
      <Route exact path="/createItem/:id" component={createItem} />
      <Route exact path="/swipping/:item/:id" component={Swipping} />
      <Route exact path="/chat/:id" component={Chat} />
      <Route exact path="/:anything" component={Welcome} />
      {window.location.pathname.includes('/chat/') ? null : <CustomFooter />}  
      {/* Modal for when other user presses 'swap items' button */}
      <Modal
        open={openSwapModal}
        className='center-align'
        actions={[]}
        options={{
          dismissible: false
        }}>
        <h3>Congrats!</h3>
        <img src={modalImage} className="circle swapItemImage"></img>
        <br></br>
        <div>Another user has alerted us that you have swapped items with them.</div>
        <div>If you confirm, your item will be deleted from Swapify.</div>
        <div>If you deny, you can continue swapping with your item.</div>
        <br></br>
        <a><Button id="modalBtn" onClick={deleteItem} modal="close">Confirm</Button></a>
        <br></br><br></br>
        <a><Button id="modalBtn" onClick={keepItem} modal="close">Deny</Button></a>
      </Modal>
      {/* Match Alert Modal */}
      <Modal
        open={openMatchModal}
        className='center-align'
        >
        <h3>Congrats!</h3>
        <h3>You have a new Match!</h3>
        <img src={modalMatchImage1} className="circle swapItemImage"></img>
        <img src={modalMatchImage2} className="circle swapItemImage"></img>
        <br></br>
        <div>Go to the Chat Page to make the swap!</div>
        <br></br>
      </Modal>

      {/* Rate User */}
      <Modal
          open={openRateModal}
          className='center-align'
          actions={[]}
          options={{
          dismissible: false
          }}>
          <h3>Congrats on your Swap!</h3>
          <br></br>
          <div>Would you like to rate the other user?</div>
          <br></br>
          <Rating
              emptySymbol={<i className="material-icons">star_border</i>}
              fullSymbol={<i className="material-icons">star</i>}
              onChange={(e) => setRating(e)}
          ></Rating>
          <br></br><br></br>
          <a><Button id="modalBtn" onClick={submitRating} modal="close">Submit Rating</Button></a>
          <br></br><br></br>
          <a><Button id="modalBtn" modal="close">No Thanks</Button></a>
      </Modal>
    </div>
  );
}


export default App;
