import React, { useEffect, useState } from "react";
import 'materialize-css';
import { useLocation, Redirect } from 'react-router-dom'
import { Navbar, Icon, NavItem } from "react-materialize";
import Badge from '@material-ui/core/Badge';
import API from "../../utils/API";
import "./style.css";

const CustomNavbar = (props) => {
const [ newText, setNewText ] = useState(false)
const [ redirect, setRedirect ] = useState(false)
const [userData, setUserData] = useState({})
const [centerLogo, setCenterLogo] = useState(false)
const [ deleteNavbarLinks, setDeleteNavbarLinks ] = useState(false)
const { pathname } = useLocation();
const pathway = pathname.split("/")
const id = pathway[pathway.length - 1]

useEffect(() => {
    checkForNewTexts()
    setInterval(function() {
        checkForNewTexts()
    }, 5000)
}, [userData])

useEffect(() => {
  if (pathway[1] === 'chat') {
    setCenterLogo(true)
  }
  else {
    setCenterLogo(false)
  }
  if (pathname === '/') {
    setDeleteNavbarLinks(true)
  }
  else {
    setDeleteNavbarLinks(false)
  }
}, [pathname])

useEffect(() => {
  if (id) {
    API.getUser(id).then((res) => {
      if (res.data.length === 0) {
        setRedirect(true)
      }
      else {
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
      }
    })
  }
}, [pathname])

function checkForNewTexts() {
    let trueCount = 0;
    if (userData) {
        API.getUserMatches(userData.googleId).then((response) => {
            for (let i = 0; i < response.data.length; i++) {
                if ((response.data[i].item1Owner === userData.googleId) && (response.data[i].item1NewText === true)) {
                    trueCount++
                }
                else if ((response.data[i].item2Owner === userData.googleId) && (response.data[i].item2NewText === true)) {
                    trueCount++
                }
            }
            if (trueCount === 0) {
                setNewText(false)
            }
            else {
                setNewText(true)
            }
        })
    }
}

  if (deleteNavbarLinks === true) {
    return (
      <div>
        {redirect ? <Redirect push to="/" /> : null}
      <Navbar
      alignLinks="right"
      brand={
        <a className="brand-logo" href="/">
          <img src="./../img/swapifyLogoTopDark-vector.png" height="150" alt="swapify logo"/>
        </a>
      }
      centerChildren
      className="navbar transparent z-depth-0"
      id="mobile-nav"
      menuIcon={
        newText ? (
          <Badge variant="dot" color="secondary" className="chatBadge">
            <Icon className="swapIcon">menu</Icon>
          </Badge>
        ) : (
          <Badge color="secondary" className="chatBadge">
            <Icon className="swapIcon">menu</Icon>
          </Badge>
        )
      }
      options={{
        draggable: true,
        edge: "right",
        inDuration: 250,
        onCloseEnd: null,
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        outDuration: 200,
        preventScrolling: true,
      }}
    >
      
    </Navbar>
    </div>
    )
  }
  else if (centerLogo === true) {
    return (
      <div>
        {redirect ? <Redirect push to="/" /> : null}
      <Navbar
      alignLinks="right"
      brand={
        <a className="brand-logo" href="/">
          <img src="./../img/swapifyLogoTopDark-vector.png" height="125" alt="swapify logo"/>
        </a>
      }
      centerLogo
      centerChildren
      className="navbar transparent z-depth-0"
      id="mobile-nav"
      menuIcon={
        newText ? (
          <Badge variant="dot" color="secondary" className="chatBadge">
            <Icon className="swapIcon">menu</Icon>
          </Badge>
        ) : (
          <Badge color="secondary" className="chatBadge">
            <Icon className="swapIcon">menu</Icon>
          </Badge>
        )
      }
      options={{
        draggable: true,
        edge: "right",
        inDuration: 250,
        onCloseEnd: null,
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        outDuration: 200,
        preventScrolling: true,
      }}
    >
      <NavItem
        tooltip="Add Item"
        href={`/createItem/${userData.googleId}`}
        className="addItem"
        alt-text="add item"
        node="button"
      >
        <Icon tooltip="Add Item" node="button">
          add_circle
        </Icon>
      </NavItem>
      <NavItem href={`/profile/${userData.googleId}`} className="profile">
        <Icon>person</Icon>
      </NavItem>
      <NavItem href={`/chat/${userData.googleId}`} className="swapIconWrapper">
        {newText ? (
          <Badge variant="dot" color="secondary" className="chatBadge">
            <Icon className="swapIcon">all_inclusive</Icon>
          </Badge>
        ) : (
          <Badge color="secondary" className="chatBadge">
            <Icon className="swapIcon">all_inclusive</Icon>
          </Badge>
        )}
      </NavItem>
    </Navbar>
    </div>
    )
  }
  else {
    return (
      <div>
        {redirect ? <Redirect push to="/" /> : null}
    <Navbar
      alignLinks="right"
      brand={
        <a className="brand-logo" href="/">
          <img src="../../img/swapifyLogoTopDark-vector.png" height="125" alt="swapify logo"/>
        </a>
      }
      centerChildren
      className="navbar transparent z-depth-0"
      id="mobile-nav"
      menuIcon={
        newText ? (
          <Badge variant="dot" color="secondary" className="chatBadge">
            <Icon className="swapIcon">menu</Icon>
          </Badge>
        ) : (
          <Badge color="secondary" className="chatBadge">
            <Icon className="swapIcon">menu</Icon>
          </Badge>
        )
      }
      options={{
        draggable: true,
        edge: "right",
        inDuration: 250,
        onCloseEnd: null,
        onCloseStart: null,
        onOpenEnd: null,
        onOpenStart: null,
        outDuration: 200,
        preventScrolling: true,
      }}
    >
      <NavItem
        tooltip="Add Item"
        href={`/createItem/${userData.googleId}`}
        className="addItem"
        alt-text="add item"
        node="button"
      >
        <Icon tooltip="Add Item" node="button">
          add_circle
        </Icon>
      </NavItem>
      <NavItem href={`/profile/${userData.googleId}`} className="profile">
        <Icon>person</Icon>
      </NavItem>
      <NavItem href={`/chat/${userData.googleId}`} className="swapIconWrapper">
        {newText ? (
          <Badge variant="dot" color="secondary" className="chatBadge">
            <Icon className="swapIcon">all_inclusive</Icon>
          </Badge>
        ) : (
          <Badge color="secondary" className="chatBadge">
            <Icon className="swapIcon">all_inclusive</Icon>
          </Badge>
        )}
      </NavItem>
    </Navbar>
    </div>
    )
  }
 
};

export default CustomNavbar;
