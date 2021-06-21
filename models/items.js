const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemsSchema = new mongoose.Schema({

  itemName: {
    type: String,
  },
 
  itemDescription: {
    type: String,
  },

  itemPrice: {
      type: Number,
  },

  imageURL: {
      type: String
  },

  itemOwner: {
      type: String
  },

  likesFromItems: [{
    type: String
  }],

  seenItems: [{
    type: String
  }],

  likesItems: [{
    type: String
  }],

  deleteItem: {
    type: String,
    default: 'false'
  },

  dateCreated: {
    type: Date,
    require: true,
    default: Date.now
  },

  itemLocation: [{
    type: String
  }]

});


const Items = mongoose.model("Items", itemsSchema);

module.exports = Items;
