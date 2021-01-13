const Game = require('../models/game')

module.exports = {
  newGame,
  joinGame,
  playCard,
  refresh
};

async function newGame(req, res) {
  const shuffledDeck = createShuffledDeck()
  
  const board = Array(25).fill('')
  board[12] = shuffledDeck.pop()

  console.log(board)

  const gameData = await Game.create({
    gameId: createGameId(), 
    playerOneName: req.body.username,
    playerOneHand: dealCards(shuffledDeck, 12),
    playerTwoHand: dealCards(shuffledDeck, 12),
    board,
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
  await game.save()
  res.json(game)
}

async function refresh(req, res) {
  const game = await Game.findOne({gameId:req.params.gameId})
  res.json(game)
}






