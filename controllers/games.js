const Game = require('../models/game')

module.exports = {
  show,
  newGame,
  update
};

function show() {
  pass
}

async function newGame(req, res) {
  const shuffledDeck = createShuffledDeck()
  
  const gameData = await Game.create({
    gameId: createGameId(), 
    playerOneName: req.body.username,
    playerOneHand: dealCards(shuffledDeck, 12),
    playerTwoHand: dealCards(shuffledDeck, 12),
    board: dealCards(shuffledDeck, 25)
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

async function update(req, res) {
  const filter = {gameId: req.params.gameId}
  let game = await Game.findOne(filter)
  console.log((req.body.playerOneHand))
  if (req.body.playerOneHand) {
    game.set({playerOneHand: req.body.playerOneHand})
  } else if (req.body.playerTwoHand) {
    game.playerTwoHand.set(req.body.playerTwoHand)
  }
  game.set({board: req.body.board})
  game.turn = req.body.turn
  await game.save()
}




