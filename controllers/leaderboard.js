const User = require('../models/user')

module.exports = {
  index,
  createLeaderboardObjects
};

async function index(req, res) {
  const users = await User.find({})
  const leaderboardObjects = createLeaderboardObjects(users)
  res.json(leaderboardObjects)
}

function createLeaderboardObjects(users) {
  const usersWithResults = users.filter(user => user.results.length > 0)
  const leaderboardObjects = usersWithResults.map(user => createLeaderboardObject(user))
  leaderboardObjects.sort((a,b) => b.ELO - a.ELO)
  return leaderboardObjects
}

function createLeaderboardObject({username, results}) {
  const lastResult = results[results.length - 1]
  const leaderboardObject = {
    name: username,
    ELO: lastResult.endingELO,
    ELOChange: lastResult.endingELO - lastResult.beginningELO
  }
  return leaderboardObject
}
