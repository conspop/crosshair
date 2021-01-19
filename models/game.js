const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardSchema = new Schema({
  number: Number,
  suit: String
})

const gameSchema = new Schema({
  playerOneName: String,
  playerTwoName: String,
  playerOneHand: [cardSchema],
  playerTwoHand: [cardSchema],
  board: [],
  turn: Boolean,
  scoreboard: Schema.Types.Mixed
});

module.exports = mongoose.model('Game', gameSchema);