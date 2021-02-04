const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const proposalSchema = new Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: String,
  endingELO: Number
});

module.exports = mongoose.model('Proposal', proposalSchema);