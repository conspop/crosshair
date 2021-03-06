const User = require('../models/user')
const Game = require('../models/game')

module.exports = {
  newGame,
  playCard,
  show,
  index,
  calculateHandValue,
  calculateHandValues,
  buildScoreboard,
  chooseWinnerAndLoser,
  buildResultObject,
  updateVersion,
  resign
};

// this adjusts how big the swing for wins and losses
KFACTOR = 32
VERSION = '2.4 - Fix Resign Function and Reverse Completed Order'

async function updateVersion(req, res) {
  const user = await User.findById(req.user._id)
  user.version = VERSION
  user.save()
  res.end()
}

async function index(req, res) {
  const user = await User.findById(req.user._id).populate('games')
  res.json(user.games)
}

async function show(req, res) {
  const game = await Game.findById(req.params.gameId)
  if (!game.lastPlayTime) {
    game.lastPlayTime = new Date()
    await game.save()
  }
  res.json({game, version: VERSION})
}

async function resign(req, res) {
  let game = await Game.findById(req.body.id)
  game.resign = req.body.resign
  const winnerAndLoser = [
    req.body.opponent,
    1,
    req.body.resign,
    0
  ]
  await recordResults(winnerAndLoser)
  await game.save()
}

async function newGame(req, res) {
  const shuffledDeck = createShuffledDeck()

  // create new game
  const game = new Game({
    playerOneName: req.body.playerOneName,
    playerTwoName: req.user.username,
    playerOneHand: dealCards(shuffledDeck, 12),
    playerTwoHand: dealCards(shuffledDeck, 12),
    board: createBoard(shuffledDeck),
    turn: chooseFirstTurn(),
    scoreboard: null,
    lastPlayTime: new Date()
  })
  await game.save()

  // add game id to users
  const playerOne = await User.findOne({username: game.playerOneName})
  const playerTwo = await User.findOne({username: game.playerTwoName})
  playerOne.games.push(game._id)
  await playerOne.save()
  playerTwo.games.push(game._id)
  await playerTwo.save()
  
  res.end()
}

function createShuffledDeck() {
  const unshuffledDeck = createUnshuffledDeck()
  const shuffledDeck = shuffle(unshuffledDeck)
  return shuffledDeck
}
  
function createUnshuffledDeck() {
  const suits = ['S', 'C', 'H', 'D']
  const unshuffledDeck = []
  for (let suit = 0; suit < suits.length; suit++) {
    for (let number = 8; number <= 14; number++) {
      unshuffledDeck.push({
        suit: suits[suit],
        number
      })
    }
  }
  return unshuffledDeck     
} 

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = deck[i]
    deck[i] = deck[j]
    deck[j] = temp
  }
  return deck
}

function dealCards(deck, numberOfCards) {
  let dealtCards = []
  for (let i = 1; i <= numberOfCards; i++) {
    dealtCards.push(deck.pop())
  }
  return dealtCards
}

function createBoard(shuffledDeck) {
  const board = Array(25).fill('')
  board[12] = shuffledDeck.pop()
  return board
}

function chooseFirstTurn() {
  return Math.floor(Math.random() * 2) === 0
}

async function playCard(req, res) {
  let game = await Game.findById(req.body.id)
  if (req.body.playerOneHand) {
    game.set({playerOneHand: req.body.playerOneHand})
  } else if (req.body.playerTwoHand) {
    game.set({playerTwoHand: req.body.playerTwoHand})
  }
  game.set({board: req.body.board})
  game.lastPlayed = req.body.lastPlayed
  game.lastPlayTime = new Date()
  game.turn = !game.turn
  if (!game.board.includes('')) {
    game.scoreboard = buildScoreboard(game)
    const winnerAndLoser = chooseWinnerAndLoser(game._id, game.scoreboard, game.playerOneName, game.playerTwoName)
    await recordResults(winnerAndLoser)
  }
  await game.save()
  res.end()
}


function buildScoreboard({board}) {
  const playerOneHandIndexesArray = [
    [0,5,10,15,20],
    [1,6,11,16,21],
    [2,7,12,17,22],
    [3,8,13,18,23],
    [4,9,14,19,24]
  ]
  const playerTwoHandIndexesArray = [
    [20,21,22,23,24],
    [15,16,17,18,19],
    [10,11,12,13,14],
    [5,6,7,8,9],
    [0,1,2,3,4]
  ]
  
  return scoreboard = {
    playerOne: calculateHandValues(board, playerOneHandIndexesArray),
    playerTwo: calculateHandValues(board, playerTwoHandIndexesArray)
  }
}

function calculateHandValues(board, handIndexesArray) {
  const handValues = []
  handIndexesArray.forEach(handIndexArray => {
    const hand = makeHand(board, handIndexArray)
    handValues.push(calculateHandValue(hand))
  })
  return handValues
}

function makeHand(board, handIndexArray) {
  const hand = []
  handIndexArray.forEach(handIndex => {
    hand.push(board[handIndex])
  })
  hand.sort((a,b) => b.number - a.number)
  return hand
}

function calculateHandValue(hand) {
  let handValue
  if (isRoyalFlush(hand)) {
    handValue = [10]
  } else if (isStraightFlush(hand)) {
    handValue = [9,hand[0].number]
  } else if (is4OfAKind(hand)) {
    handValue = get4OfAKindValue(hand)
  } else if (isFullHouse(hand)) {
    handValue = getFullHouseValue(hand)
  } else if (isFlush(hand)) {
    const numbersArray = hand.map(card => card.number)
    handValue = [6, ...numbersArray]
  } else if (isStraight(hand)) {
    handValue = [5, hand[0].number]
  } else if (is3OfAKind(hand)) {
    handValue = get3OfAKindValue(hand)
  } else if (is2Pair(hand)) {
    handValue = get2PairValue(hand)
  } else if (isPair(hand)) {
    handValue = getPairValue(hand)
  } else {
    handValue = [1, ...hand.map(card => card.number)]
  }
  return handValue
}


function isRoyalFlush(hand) {  
  const isFlush = areAllSameSuit(hand)
  const isStraight = areStraight(hand)
  const highCard = hand[0].number
  return (
    isFlush && 
    isStraight &&
    highCard === 14
  )
}

function isStraightFlush(hand) {
  const isFlush = areAllSameSuit(hand)
  const isStraight = areStraight(hand)
  return (
    isFlush &&
    isStraight
  )
}

function is4OfAKind(hand) {
  const set1 = hand.slice(0,4)
  const set2 = hand.slice(1)
  return (
    areSameNumber(set1) ||
    areSameNumber(set2)
  )
}

function get4OfAKindValue(hand) {
  const set1 = hand.slice(0,4)
  const set2 = hand.slice(1)
  if (areSameNumber(set1)) {
    const handValue = [8, set1[0].number, hand[4].number]
    return handValue
  } else if (areSameNumber(set2)) {
    const handValue = [8, set2[0].number, hand[0].number]
    return handValue
  }
}

function isFullHouse(hand) {
  const set1 = [hand.slice(0,3), hand.slice(3)]
  const set2 = [hand.slice(2), hand.slice(0,2)]
  return (
    (areSameNumber(set1[0]) && areSameNumber(set1[1])) ||
    (areSameNumber(set2[0]) && areSameNumber(set2[1]))
  )
}

function getFullHouseValue(hand) {
  const set1 = [hand.slice(0,3), hand.slice(3)]
  const set2 = [hand.slice(2), hand.slice(0,2)]
  let handValue
  if (areSameNumber(set1[0]) && areSameNumber(set1[1])) {
    handValue = [7, set1[0][0].number, set1[1][0].number]
  } else if (areSameNumber(set2[0]) && areSameNumber(set2[1])) {
    handValue = [7, set2[0][0].number, set2[1][0].number]
  }
  return handValue
}

function isFlush(hand) {
  return areAllSameSuit(hand)
}

function isStraight(hand) {
  return areStraight(hand)
}

function is3OfAKind(hand) {
  const set1 = hand.slice(0,3)
  const set2 = hand.slice(1,4)
  const set3 = hand.slice(2)
  return (
    areSameNumber(set1) ||
    areSameNumber(set2) ||
    areSameNumber(set3)
  )
}

function get3OfAKindValue(hand) {
  const set1 = hand.slice(0,3)
  const set2 = hand.slice(1,4)
  const set3 = hand.slice(2)
  let handValue
  if (areSameNumber(set1)) {
    handValue = [4, set1[0].number, hand[3].number, hand[4].number]
  } else if (areSameNumber(set2)) {
    handValue = [4, set2[0].number, hand[0].number, hand[4].number]
  } else if (areSameNumber(set3)) {
    handValue = [4, set3[0].number, hand[0].number, hand[1].number]
  }
  return handValue
}

function is2Pair(hand) {
  let pairs = []
  let single
  for (let index = 0; index <= 4; index++) {
    if (index < 4 && hand[index].number === hand[index + 1].number) {
      pairs.push(hand[index].number)
    } else if (index > 0 && hand[index].number !== hand[index -1].number) {
      single = hand[index].number
    } else if (index === 0 && hand[index].number !== hand[index + 1].number) {
      single = hand[index].number
    }
  }
  return (pairs.length === 2)
}

function get2PairValue(hand) {
  let pairs = []
  let single

  for (let index = 0; index <= 4; index++) {
    if (index < 4 && hand[index].number === hand[index + 1].number) {
      pairs.push(hand[index].number)
    } else if (index > 0 && hand[index].number !== hand[index -1].number) {
      single = hand[index].number
    } else if (index === 0 && hand[index].number !== hand[index + 1].number) {
      single = hand[index].number
    }
  }
  const handValue = [3, ...pairs, single]
  return handValue
}

function isPair(hand) {
  const set1 = [hand.slice(0,2), hand.slice(2)]
  const set2 = [hand.slice(1,3), [hand[0].number, hand[3], hand[4]]]
  const set3 = [hand.slice(2,4), [hand[0], hand[1], hand[4]]]
  const set4 = [hand.slice(3), hand.slice(0,3)]
  return (
    areSameNumber(set1[0]) ||
    areSameNumber(set2[0]) ||
    areSameNumber(set3[0]) ||
    areSameNumber(set4[0])
  )
}

function getPairValue(hand) {
  const set1 = [hand.slice(0,2), hand.slice(2)]
  const set2 = [hand.slice(1,3), [hand[0], hand[3], hand[4]]]
  const set3 = [hand.slice(2,4), [hand[0], hand[1], hand[4]]]
  const set4 = [hand.slice(3), hand.slice(0,3)]
  let handValue
  if (areSameNumber(set1[0])) {
    handValue = [2, set1[0][0].number, ...set1[1].map(card => card.number)]
  }
  if (areSameNumber(set2[0])) {
    handValue = [2, set2[0][0].number, ...set2[1].map(card => card.number)]
  }
  if (areSameNumber(set3[0])) {
    handValue = [2, set3[0][0].number, ...set3[1].map(card => card.number)]
  }
  if (areSameNumber(set4[0])) {
    handValue = [2, set4[0][0].number, ...set4[1].map(card => card.number)]
  }
  return handValue
}

function areAllSameSuit(handArray) {
  const suits = handArray.map(card => card.suit)
  return suits.every(suit => suit === suits[0])
}

function areStraight(hand) {
  return (
    hand[0].number - 1 === hand[1].number &&
    hand[1].number - 1 === hand[2].number &&
    hand[2].number - 1 === hand[3].number &&
    hand[3].number - 1 === hand[4].number
  )
}

function areSameNumber(set) {
  return set.every(card => card.number === set[0].number)
}

function chooseWinnerAndLoser(gameId, scoreboard, playerOne, playerTwo) {
  let playerOneWins = 0
  let playerTwoWins = 0
  for (let hand = 0; hand < 5; hand++) {
    for (let index = 0; index <= 6; index++ ) {
      if (scoreboard.playerOne[hand][index] > scoreboard.playerTwo[hand][index]) {
        playerOneWins ++
        break
      } else if (scoreboard.playerOne[hand][index] < scoreboard.playerTwo[hand][index]) {
        playerTwoWins ++
        break
      }
    }
  }
  let winnerAndLoser
  if (playerOneWins > playerTwoWins) {
    winnerAndLoser = [playerOne, playerOneWins, playerTwo, playerTwoWins]
  } else {
    winnerAndLoser = [playerTwo, playerTwoWins, playerOne, playerOneWins]
  }
  return winnerAndLoser
}

async function recordResults(winnerAndLoser) {
  const winner = await User.findOne({username: winnerAndLoser[0]})
  const loser = await User.findOne({username: winnerAndLoser[2]})

  let winnerOldELO
  let loserOldELO
  if (winner.results.length > 0) {
    winnerOldELO = winner.results[winner.results.length - 1].endingELO
  } else {
    winnerOldELO = 1500
  }
  if (loser.results.length > 0) {
    loserOldELO = loser.results[loser.results.length - 1].endingELO
  } else {
    loserOldELO = 1500
  }
  
  const winnerResult = buildResultObject(winnerOldELO, loserOldELO, KFACTOR, loser.username, true)
  const loserResult = buildResultObject(loserOldELO, winnerOldELO, KFACTOR, winner.username, false)

  winner.results.push(winnerResult)
  await winner.save()
  loser.results.push(loserResult)
  await loser.save()
}

function buildResultObject(playerOldELO, opponentOldELO, kFactor, opponent, isWin) {
  const resultObject = {
    beginningELO: playerOldELO,
    opponent,
    isWin,
    endingELO: calculateNewELO(playerOldELO, opponentOldELO, kFactor, isWin),
    date: new Date()
  }
  return resultObject
}

function calculateNewELO(playerOldELO, opponentOldELO, kFactor, isWin) {
  let playerTransformed = 10 ** (playerOldELO / 400)
  let opponentTransformed = 10 ** (opponentOldELO / 400)

  let playerExpected = playerTransformed / (playerTransformed + opponentTransformed)

  let playerNewELO
  if (isWin) {
    playerNewELO = Math.round(playerOldELO + kFactor * (1 - playerExpected))
  } else {
    playerNewELO = Math.round(playerOldELO + kFactor * (0 - playerExpected))
  }

  return playerNewELO
}


