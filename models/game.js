const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
  number: Number,
  suit: String
})

const gameSchema = new Schema({
  gameId: String,
  playerOneName: String,
  playerTwoName: String,
  playerOneHand: [cardSchema],
  playerTwoHand: [cardSchema],
  board: [],
  turn: Boolean
});

module.exports = mongoose.model('Game', gameSchema);