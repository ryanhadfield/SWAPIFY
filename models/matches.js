const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matchesSchema = new mongoose.Schema({

 item1Id: {
    type: String
 },

 item1Owner: {
    type: String
 },

 item1Photo: {
   type: String
 },

 item1Name: {
   type: String
 },

 item2Id: {
    type: String
 },

 item2Owner: {
    type: String
 },

 item2Photo: {
   type: String
 },

 item2Name: {
   type: String
 },

 item2Read: {
     type: Boolean,
     default: false
 },

 item1NewText: {
   type: Boolean,
   default: true
 },

 item2NewText: {
  type: Boolean,
  default: true
}


});


const Matches = mongoose.model("Matches", matchesSchema);

module.exports = Matches;
