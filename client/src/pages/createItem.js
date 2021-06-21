import React, { useState, useEffect } from "react";
import API from "../utils/API";
import { Input, TextArea, FormBtn } from "../components/Form";
import { storage } from "../utils/firebase";
import { Redirect, useParams, BrowserRouter as Router } from "react-router-dom";
import Compressor from "compressorjs";
import Confetti from "react-dom-confetti";
import { Col, Row, Textarea, Button, Preloader } from "react-materialize";
import "./createItemStyle.css";



function Item() {
  const [reward, setReward] = useState(false);
  const [descriptionState, setDescriptionState] = useState([]);
  const [nameState, setNameState] = useState([]);
  const [image, setImage] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [buttonText, setButtonText] = useState("Preview");
  const [userLocation, setUserLocation] = useState([""]);
  const [wait, setWait] = useState(false);
  const [ activatePreloader, setActivatePreloader ] = useState(false)
  const { id } = useParams();
  const [userData, setUserData] = useState({
    email: "",
    firstName: "",
    googleId: "",
    image: "",
    lastName: "",
    listedItems: [],
    rating: [],
  });

  useEffect(() => {
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
    });
    if (userData === null) {
      setRedirect(true);
    }
    const fileUpload = document.getElementById("fileBox");
    fileUpload.addEventListener("click", function (event) {});

    getUserLocation();
  }, []);

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(saveUserLocation);
    } else {
      alert = "Geolocation is not supported by this browser.";
    }
  }

  function saveUserLocation(position) {
    setUserLocation([position.coords.latitude, position.coords.longitude]);
  }

  //sets the selectedFile state when a a user drops in a file.
  function handleFileChange(e) {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  function handleDescriptionChange(event) {
    const desc = event.target.value;
    setDescriptionState({ ...descriptionState, description: desc });
  }

  function handleNameChange(event) {
    const name = event.target.value;
    setNameState({ ...nameState, name: name });
  }

  function previewUploadHandler() {
    if (buttonText === "Preview") {
      previewHandler();
      setButtonText("Upload");
    } else {
      fileUploadHandler();
    }
  }
  const fileUploadHandler = () => {
    setActivatePreloader(true)
    // Compress image before uploading to firebase
    new Compressor(image, {
      quality: 0.2,
      success(result) {

        // uploads image to firebase
        const randomNumber = Math.floor(Math.random() * 100000000);
        const uploadTask = storage
          .ref(`images/${randomNumber + image.name}`)
          .put(result);
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log(error);
          },
          () => {
            storage
              .ref("images")
              .child(randomNumber + image.name)
              .getDownloadURL()

              .then(url => {
                saveToDatabase(url, image.name);
                setImageURL(url);
                console.log("fileupload handler run");
                //setButtonText("Preview")
                setReward(!reward);
                setActivatePreloader(false)
                setTimeout(() => setWait(true), 3000);
                // window.location.href="/profile"
              });
          }
        );
      },
      error(err) {
        console.log(err.message);
      },
    });
  };

  function previewHandler() {
    setActivatePreloader(true)
    // Compress image before uploading to firebase
    new Compressor(image, {
      quality: 0.2,
      success(result) {
        // uploads image to firebase
        const randomNumber = Math.floor(Math.random() * 100000000);
        const uploadTask = storage
          .ref(`images/${randomNumber + image.name}`)
          .put(result);
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            console.log(error);
          },
          () => {
            storage
              .ref("images")
              .child(randomNumber + image.name)
              .getDownloadURL()
              .then((url) => {
                //saveToDatabase(url);
                setActivatePreloader(false)
                setImageURL(url);
              });
          }
        );
      },
      error(err) {
        console.log(err.message);
      },
    });
  }

  function saveToDatabase(url, imageName) {
    const splitURL = imageName.split(".")
    const newImageName = (splitURL[0] + "_500x500." + splitURL[1])
    const newURL = url.replace(imageName, newImageName)
    const newItem = {
      itemName: nameState.name,
      itemDescription: descriptionState.description,
      itemPrice: 45,
      imageURL: `${newURL}`,
      itemOwner: userData.googleId,
      likesFromItems: [],
      likesItems: [],
      seenItems: [],
      itemLocation: userLocation,
    };
    API.saveItem(newItem).then((itemResponse) => {
      const itemId = itemResponse.data._id;
      API.getUser(userData.googleId).then((res) => {
        const updatedUser = {
          listedItems: res.data[0].listedItems,
        };
        updatedUser.listedItems.push(itemId);
        API.updateUser(userData.googleId, updatedUser);
        console.log("save to database run");
      });
    });
  }

  return (
    // this cant be a form for some reason?
    <div className="container addItem" style={{ marginTop: "50px" }}>
      {redirect ? <Redirect push to="/" /> : null}                
      <div className="row">
        <div className="col m7 s6 nameInput">
          <Textarea
            onChange={handleNameChange}
            name="name"
            label="Add Item Name"
            style={{ color: "#025159" }}
            id="TextInput-5"
          />
        </div>

        <div className="col m5 s6">
          <form action="#">
            <div className="file-field input-field">
              <div className="btn" style={{ color: "#D4EEE3" }}>
                {/* <span>File</span> */}
                <input
                  type="file"
                  id="fileBox"
                  onChange={handleFileChange}
                  style={{ color: "#03A696" }}
                />
                <i className="material-icons">camera_alt</i>
              </div>
              <div className="file-path-wrapper">
                <input
                  className="file-path validate"
                  type="text"
                  placeholder="Choose a photo"
                  style={{ color: "#f25d27" }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="center-align">

        {imageURL && (
          <img
            className="responsive-img"
            src={imageURL}
            style={{ maxWidth: "50%", height: "auto" }}
          />
        )}
      </div>
      <div className="row">
        <div className="col m12 s12">
          <Textarea
            onChange={handleDescriptionChange}
            name="description"
            label="Add a description"
            style={{ color: "#025159" }}
          />
          <div className="container right-align">
            <Row>
              <Col s={6} m={6}></Col>
              <Col s={6} m={6}>
                <Confetti
                  id="confetti"
                  active={reward}
                  className="right-align"
                />
              </Col>
            </Row>
          </div>
        </div>

      </div>

      <Row>
        <Col s={12} m={12} className="center fullHeight">
        <Preloader
        className="preloaderLocation"
        active={activatePreloader}
        color="blue"
        flashing={false}
        size="big"
        />
        <br></br><br></br>
          <Button
            // disabled={!(formObject.author && formObject.title)}
            //onClick={fileUploadHandler}
            large
            node="a"
            id="mainFileBtn"
            onClick={previewUploadHandler}
            style={{
              marginRight: "5px",
            }}
          >
            {buttonText}
          </Button>

          {wait ? <Redirect to={`/profile/${userData.googleId}`} /> : ""}
        </Col>
      </Row>
    </div>
  );
}

export default Item;
