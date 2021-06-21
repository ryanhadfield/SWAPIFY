import React, { useState } from "react";
import { Button, Modal } from "react-materialize";
import API from "../../utils/API";
import DeleteIcon from "@material-ui/icons/Delete";
import ReactTooltip from "react-tooltip";
import "./style.css";

const ItemCard = (props) => {

  const [openDeleteModal, setOpenDeleteModal ] = useState(false)

  return (
    <div>
    <div class="card itemCard">
        <div class="card-image">
          <img src={props.imageURL} className="itemCardImage" draggable="false" />
          <span class="card-title itemCardTitle truncate"  style={{
              height: "70px",
              lineHeight: "70px",
              paddingLeft: "0px",
              fontFamily: "proxima-nova, sans-serif",
              fontWeight: "700",
              fontStyle: "normal",
              fontSize: "20px",
              color: "#025159",
            }}>{props.itemName}</span>
        </div>
        <div class="card-content center-align">
          <a href={`/swipping/${props.id}/${props.userData.googleId}`}><Button id="modalBtn" className="cardSwapButton" onClick={() => API.handleUseItem(props.id)}><div className="swapText">Swap</div></Button></a>
          <br></br>
          <Button style={{marginTop: "10px"}} className="cardDeleteButton"  onClick={() => setOpenDeleteModal(true)}><i class="material-icons deleteIcon">delete</i></Button>
        </div>
    </div>
    <Modal
        open={openDeleteModal}
        className='center-align modal'
        actions={[]}
        options={{
          dismissible: false
        }}
        >
        <h3>Are you sure you want to do that?</h3>
        <br></br>
        <div>If you delete this item it will be gone forever!</div>
        <br></br><br></br>
        <a>
          <Button id="modalBtn" modal="close" onClick={() => {
              API.deleteItem(props.id).then((results) => {
                props.loadItems();
              });
            }}
          >Delete</Button>
        </a>
        <br></br><br></br>
        <a>
          <Button id="modalBtn" onClick={() => setOpenDeleteModal(false)} modal="close">Cancel</Button>
        </a>
        <br></br>
    </Modal>
    </div>

            
  );
};
export default ItemCard;
