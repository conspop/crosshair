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
  // console.log(proposals)
  for (let i = 0; i < proposals.length; i++) {
    const user = await User.findById(proposals[i].playerId)
    proposals[i].endingELO = user.results[user.results.length - 1].endingELO || 1500
  }
  res.json(proposals)
}

async function create(req, res) {
  const user = await User.findById(req.user._id)
  const endingELO = user.results[user.results.length - 1].endingELO
  console.log(endingELO)
  const proposal = new Proposal({playerId: req.user._id, name: req.user.username, endingELO})
  await proposal.save()
  res.end()
}

async function acceptProposal(req, res) {
  const {name} = req.body
  Proposal.deleteOne({name}, function (err) {
    if (err) {console.log(err.message)}
  })
  res.end()
}