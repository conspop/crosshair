const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema({
  playerOneName: String,
  playerTwoName: String,
  playerOneHand: [],
  playerTwoHand: [],
  board: [],
  turn: Boolean,
  lastPlayed: Number,
  scoreboard: Schema.Types.Mixed,
  resign: String
});

module.exports = mongoose.model('Game', gameSchema);