import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../utils/API";
import ItemCard from "../components/ItemCard";
import {
  Button,
  Col,
  Row,
  Collection
} from "react-materialize";
import ReactTooltip from 'react-tooltip';
import { motion } from "framer-motion";
import ScrollMenu from 'react-horizontal-scrolling-menu';
import "./profileStyle.css"


//document.body.style = "background: -webkit-gradient(linear, top, bottom, from(#003399), to(#6699cc));background: -webkit-linear-gradient(#025159, #03A696);background: linear-gradient(#025159, #03A696);zoom: 1;margin: 0;padding-top: 2%;padding-bottom: 3%;background-attachment: fixed;"

function Profile() {
  const [usersItemList, setUsersItemList] = useState([]);
  const [matchList, setMatchList] = useState([]);
  const [userData, setUserData] = useState({
    email: "",
    firstName: "",
    googleId: "",
    image: "",
    lastName: "",
    listedItems: [],
    rating: [],
  });
  const [imageArray, setImageArray] = useState([""]);
  const { id } = useParams();
  const [userRating, setUserRating] = useState(0);

  let matchArray = [];

  useEffect(() => {
    loadItems();
    loadImages();
    API.getUser(id).then((res) => {
      const newUser = {
        email: res.data[0].email,
        firstName: res.data[0].firstName,
        googleId: res.data[0].googleId,
        image: res.data[0].image,
        lastName: res.data[0].lastName,
        listedItems: res.data[0].listedItems,
        rating: res.data[0].rating,
      };
      setUserData(newUser);
      if (res.data[0].rating.length === 0) {
        setUserRating(0);
      } else {
        let ratingCount = 0;
        for (let i = 0; i < res.data[0].rating.length; i++) {
          ratingCount = ratingCount + res.data[0].rating[i];
        }
        setUserRating(Math.round(ratingCount / res.data[0].rating.length));
      }
    });
  }, []);

  useEffect(() => {
    loadItems();
    loadImages();
  }, [userData]);

  function loadImages() {
    let tempArray = [];
    usersItemList.forEach((item, i) => {
      tempArray.push(item.imageURL);
    });
    if (usersItemList.length == 0) {
      return;
    }
    console.log(tempArray);
    setImageArray(tempArray);
  }

  function loadItems() {
    if (userData === null) {
      //   setRedirect(true)
    }
    API.getUserItems(userData.googleId).then((response) => {
      setUsersItemList(response.data);
    });
    API.getUserMatches(userData.googleId).then((matchResponse) => {
      matchResponse.data.forEach((item) => {
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
          };
          matchArray.push(itemInfo);
          if (matchResponse.data.length === matchArray.length) {
            setMatchList(matchArray);
          }
        } else {
          const itemInfo = {
            userItemId: item.item2Id,
            userId: item.item2Owner,
            userItemPhoto: item.item2Photo,
            userItemName: item.item2Name,
            otherItemId: item.item1Id,
            otherUser: item.item1Owner,
            otherItemImage: item.item1Photo,
            otherItemName: item.item1Name,
          };
          matchArray.push(itemInfo);
          if (matchResponse.data.length === matchArray.length) {
            setMatchList(matchArray);
          }
        }
      });
    });
  }

  function handleUseItem(id) {
    console.log(id);
    localStorage.setItem("itemData", JSON.stringify(id));
    //  setRedirectToSwipping(true)
  }


  return (
    <div>
      {/* {redirect ? (<Redirect push to="/" />) : null} */}

      <div className="container center-align" style={{ marginTop: "20px" }}>
        <div className="row">
          <div className="col m12 s12 ">
            <motion.img
              animate={{ y: 1, opacity: 1 }}
              initial={{ y: -50, opacity: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.5,
                // type: "spring",
                // stiffness: 50,
              }}
              alt=""
              className="circle z-depth-3"
              style={{
                height: "150px",
                width: "150px",
                marginTop: "50px",
              }}
              src={userData.image}
            />
          </div>
        </div>
        <div className="row">
          <div className="col m12 s12 center-align" data-tip="Your Swapify rating">
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: .2, delay: 0.2 }}
              className="col m12 s12 center-align">
              {Array(userRating)
                .fill()
                .map((el, i) => (
                  <i
                    className="material-icons"
                    key={i}
                    style={{ color: "#F25D27" }}
                  >
                    star
                </i>
                ))}
              {Array(5 - userRating)
                .fill()
                .map((el, i) => (
                  <i
                    className="material-icons"
                    key={i}
                    style={{ color: "#F25D27" }}
                  >
                    star_border
                </i>
                ))}
            </motion.div>
          
            <ReactTooltip place="bottom" type="light" effect="float"/>
          </div>
        </div>



        <Row className="valign-wrapper">
        </Row>
        <Row>
          <div className="col m12 s12 ">
            <motion.h2
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{ color: "#03A696" }}
              className="userName"
            >

              {userData.firstName} {userData.lastName}
            </motion.h2>
          </div>
        </Row>
      
      <Row className="valign-wrapper">
        <Col m={8} s={8} className="right-align">
          <h4 style={{ color: "#025159" }}>Add Item</h4>
        </Col>
        <Col m={6} s={6} className="left-align">
          <Button
            floating={true}
            large={true}
            style={{ backgroundColor: "#F25D27" }}
          >
            <Link to={`/createItem/${userData.googleId}`}>
              <i className="material-icons">add</i>
            </Link>
          </Button>
        </Col>
      </Row>
      <Row style={{ paddingTop: "10px" }}>
        <h4
          style={{
            fontFamily: "lemon",
            color: "#f28704",
            paddingBottom: "20px",
          }}
        >
          Your Items
          </h4>
         <Col s={12} style={{paddingTop: "50px"}}>
        <ScrollMenu
          
          arrowLeft={<div style={{ fontSize: "30px", paddingRight: "10px" }}>{" < "}</div>}
          arrowRight={<div style={{ fontSize: "30px", paddingLeft: "10px" }}>{" > "}</div>}
          itemStyle={{paddingLeft:"15px"}}
          itemClassActive={'null'}
          data={usersItemList.map((item, index) => (
            <ItemCard
              key={index}
              loadItems={loadItems}
              imageURL={item.imageURL}
              itemName={item.itemName}
              id={item._id}
              itemDescription={item.itemDescription}
              userData={userData}
            />
          ))}
        />
        </Col>
      </Row>

      <Row style={{ height: "400px" }}></Row>
    </div>
    </div >
  );
}

export default Profile;
