const Game = require('../models/game')

module.exports = {
  show,
  newGame
};

function show() {
  pass
}

function newGame(req, res) {
  createNewGame(req.body.username)
  dealHands()

  async function createNewGame(username) {
    let gameId = ''
    while (gameId.length < 5) {
      gameId += (Math.floor(Math.random() * 9) + 1)
    }
    await Game.create({
      gameId, 
      playerOneName: username
    })
  }

  async function dealHands() {
    const deck = shuffleDeck()

    function shuffleDeck() {
      
      console.log(createUnshuffledDeck())

      function createUnshuffledDeck() {
        const suits = ['S', 'C', 'H', 'D']
        const unshuffledDeck = []
        for (let suit = 0; suit < suits.length; suit++) {
          for (let number = 1; number <= 13; number++) {
            unshuffledDeck.push({
              suit: suits[suit],
              number
            })
          }
        }
        return unshuffledDeck     
      } 

    }

  }
}




