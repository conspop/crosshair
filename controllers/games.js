const Game = require('../models/game')

module.exports = {
  newGame,
  joinGame,
  playCard,
  refresh,
  checkHand
};

async function newGame(req, res) {
  const shuffledDeck = createShuffledDeck()
  
  const board = Array(25).fill('')
  // board[12] = shuffledDeck.pop()

  console.log(board)

  const gameData = await Game.create({
    gameId: createGameId(), 
    playerOneName: req.body.username,
    playerOneHand: dealCards(shuffledDeck, 12),
    playerTwoHand: dealCards(shuffledDeck, 12),
    board: dealCards(shuffledDeck, 25),
    turn: true
  })

  res.json(gameData)

  function createGameId() {
    let gameId = ''
    while (gameId.length < 5) {
      gameId += (Math.floor(Math.random() * 9) + 1)
    }
    return gameId
  }

  function dealCards(deck, numberOfCards) {
    let dealtCards = []
    for (let i = 1; i <= numberOfCards; i++) {
      dealtCards.push(deck.pop())
    }
    return dealtCards
  }

  function createShuffledDeck() {
    const unshuffledDeck = createUnshuffledDeck()
    const shuffledDeck = shuffle(unshuffledDeck)
    return shuffledDeck
    
    function createUnshuffledDeck() {
      const suits = ['S', 'C', 'H', 'D']
      const unshuffledDeck = []
      for (let suit = 0; suit < suits.length; suit++) {
        for (let number = 2; number <= 14; number++) {
          unshuffledDeck.push({
            suit: suits[suit],
            number
          })
        }
      }
      return unshuffledDeck     
    } 
    
    //Fisher-Yates Algorithm
    function shuffle(deck) {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = deck[i]
        deck[i] = deck[j]
        deck[j] = temp
      }
      return deck
    }
  }
}

async function joinGame(req, res) {
  const {gameId, username} = req.body
  const game = await Game.findOne({gameId})
  console.log(game)
  if (game.playerOneName === username || game.playerTwoName === username) {
    console.log('You are one of the existing players')
    res.json(game)
  } else if (game.playerOneName && game.playerTwoName) {
    console.log('Messed up')
    res.status(400).json({
      message: 'This username is not in the gameId you provided.'
    })
  } else {
    console.log('Creating player 2')
    game.playerTwoName = req.body.username
    await game.save()
    res.json(game)
  }
}

async function playCard(req, res) {
  const filter = {gameId: req.body.gameId}
  let game = await Game.findOne(filter)
  if (req.body.playerOneHand) {
    game.set({playerOneHand: req.body.playerOneHand})
  } else if (req.body.playerTwoHand) {
    game.set({playerTwoHand: req.body.playerTwoHand})
  }
  game.set({board: req.body.board})
  game.turn = !game.turn
  checkWinner(game)
  await game.save()
  res.json(game)
}

async function refresh(req, res) {
  const game = await Game.findOne({gameId:req.params.gameId})
  res.json(game)
}

function checkWinner({board}) {
  if (board.includes('')) {
    console.log('game is not over!')
    return
  } else {
    checkHand([
      board[0],
      board[1],
      board[2],
      board[3],
      board[4]
    ])
  }
}

function checkHand(hand) {
  hand.sort((a,b) => a.number - b.number)
  
  return checkRoyalFlush(hand)

  function checkRoyalFlush(hand) {  
    const isFlush = areAllSameSuit(hand)
    const isStraight = areStraight(hand)
    
    if (
      isFlush &&
      isStraight &&
      hand[4].number === 14
    ) {
      const handValue = [10]
      console.log(typeof(handValue))
      return handValue
    }
    return checkStraightFlush(hand)
  }

  function checkStraightFlush(hand) {
    if (
      areAllSameSuit(hand) &&
      areStraight(hand)
    ) {
      return [9,hand[4].number]
    } else {
      return check4OfAKind()
    }
  }

  function check4OfAKind(hand) {
    if (
      hand.slice(0,4).every(num => num[0]) ||
      hand.slice(1).every(num => num[0])
    ) {
      return [8,hand[2].number]
    } else {
      return check4OfAKind()
    }
  }

  function areAllSameSuit(handArray) {
    const suits = handArray.map(card => card.suit)
    return suits.every(suit => suit === suits[0])
  }

  function areStraight(hand) {
    return (
      hand[0].number + 1 === hand[1].number &&
      hand[1].number + 1 === hand[2].number &&
      hand[2].number + 1 === hand[3].number &&
      hand[3].number + 1 === hand[4].number
    )
  }
}






