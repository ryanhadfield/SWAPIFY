import React, { useState } from "react";
import API from "../utils/API";
import GoogleLogin from "react-google-login";
import { Redirect } from "react-router-dom";
import "materialize-css";
// import "./style.css";
import "./welcomeStyle.css";
import { motion } from "framer-motion";
import { Button } from "react-materialize";

function Welcome() {

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const [redirect, setRedirect] = useState(false);
const [userID, setUserID] = useState('')

const googleSuccess = async (response) => {
    const userObj = response.profileObj
    setUserID(userObj.googleId)
    const user = {
        email: userObj.email,
        firstName: userObj.givenName,
        lastName: userObj.familyName,
        image: userObj.imageUrl,
        googleId: userObj.googleId,
        listedItems: []
    }
    API.getUser(userObj.googleId).then(res => {
        if (res.data.length > 0) {
            setRedirect(true)
        }
        else {
            API.saveUser(user)
            setRedirect(true)
        }
    }).catch(error => console.log(error))

}

const googleFailure = (response) => {
console.log("Google Sign in was unsuccessful");
alert("please try logging in again");
console.log(response);
};

return (
  <div className="welcomeBackground">
    <div className="hero-image">
      <div className="container center">
        <div className="row opening">
          <motion.h1
            animate={{ y: 0, opacity: 1 }}
            initial={{ y: -250, opacity: 0 }}
            transition={{
              delay: 0.5,
              duration: 1,
              type: "spring",
              stiffness: 150,
            }}
          >
            Recycle your life!
          </motion.h1>
        </div>
        <div className="row">
          <motion.img
            animate={{ rotateZ: 1080, opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.2, duration: 1.8 }}
            whileHover={{ rotateZ: 180 }}
            src="./../img/swapifyLogo-S-vector.png"
            alt="Swapify S Logo"
            class="responsive-img"
          />
          {/* <motion.img
                      animate={{ x: 0, opacity: 1 }}
                      initial={{ opacity: 0 }}
                      transition={{ delay: 2.5, duration: 0.5 }}
                      src="./../img/wapifyLogoCenter-vector.png"
                      alt="Swapify Logo"
                      class="responsive-img"
                  /> */}
        </div>

        <div className="row login">
          {redirect ? <Redirect push to={`/profile/${userID}`} /> : null}
          <GoogleLogin
            className="loginBtn"
            clientId={googleClientId}
            buttonText="Get Swapp'n!"
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={false}
            render={(renderProps) => (
              <motion.a
                animate={{ opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                transition={{ delay: 2, duration: 1 }}
              >
                <Button
                  large
                  className="loginBtn z-depth-3"
                  node="a"
                  style={{
                    marginRight: "5px",
                  }}
                  waves="light"
                  onClick={renderProps.onClick}
                >
                  Start Swap'n!
                </Button>
              </motion.a>
            )}
          />
        </div>
      </div>
    </div>




    <div className="container center ">
      <div className="row howTo">
        <motion.h2
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 2.5, duration: 2 }}
        >
          How Swapify works:{" "}
        </motion.h2>
      </div>
      <motion.div
        className="row howToRow"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ delay: 2.5, duration: 2 }}
        whileHover={{}}
      >
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          // transition={{ delay: 3, duration: 2 }}
          whileHover={{
            scale: 1.2,
          }}
          className="row"
        >
          <div className="col l4 s12 center symbol1">
            <motion.img
              src="./../img/profileSymbol.png"
              alt="Swapify Logo"
              height="100px"
            />
          </div>
          <div className="col l6 s12 center">
            <motion.h4
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 1000 }}
              transition={{ delay: 3, duration: 1 }}
              className="how1"
            >
              Sign into your Profile
            </motion.h4>
          </div>
        </motion.div>
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          // transition={{ delay: 3, duration: 2 }}
          whileHover={{
            scale: 1.2,
          }}
          className="row"
        >
          <div className="col l4 s12 center symbol2">
            <motion.img
              src="./../img/addItemSymbol.png"
              alt="Swapify Logo"
              height="100px"
            />
          </div>
          <div className="col l6 s12 center">
            <motion.h4
              animate={{ opacity: 1, x: 1 }}
              initial={{ opacity: 0, x: 1000 }}
              transition={{ delay: 3, duration: 1 }}
              className="how2"
            >
              Add a new item to swap
            </motion.h4>
          </div>
        </motion.div>
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          // transition={{ delay: 3, duration: 2 }}
          whileHover={{
            scale: 1.2,
          }}
          className="row"
        >
          <div className="col l4 s12 center symbol3">
            <motion.img
              src="./../img/swipeSymbol.png"
              alt="Swapify Logo"
              height="100px"
            />
          </div>
          <div className="col l6 s12 center">
            <motion.h4
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 1000 }}
              transition={{ delay: 3, duration: 1 }}
              className="how3"
            >
              Browse & swipe to match
            </motion.h4>
          </div>
        </motion.div>
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          // transition={{ delay: 3, duration: 2 }}
          whileHover={{
            scale: 1.2,
          }}
          className="row"
        >
          <div className="col l4 s12 center symbol4">
            <motion.img
              src="./../img/swapSymbol2.png"
              alt="Swapify Logo"
              height="100px"
            />
          </div>
          <div className="col l6 s12 center">
            <motion.h4
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 1000 }}
              transition={{ delay: 3, duration: 1 }}
              className="how4"
            >
              Chat and swap with matches
            </motion.h4>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </div>
);
}

export default Welcome;