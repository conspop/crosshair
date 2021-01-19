const User = require('../models/user')
const Proposal = require('../models/proposal')
const Game = require('../models/game')
const games = require('./games')

module.exports = {
  index,
  create,
  acceptProposal
};

async function index(req, res) {
  const proposals = await Proposal.find({}).populate('player')
  res.json(proposals)
}

async function create(req, res) {
  const proposal = new Proposal({playerId: req.user._id, name: req.user.username})
  await proposal.save()
  res.json('ok')
}

async function acceptProposal(req, res) {
  const {name} = req.body
  Proposal.deleteOne({name}, function (err) {
    if (err) {console.log(err.message)}
  })
  res.end()
}