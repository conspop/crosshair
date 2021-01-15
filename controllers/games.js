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
  hand.sort((a,b) => b.number - a.number)
  
  return checkRoyalFlush(hand)

  function checkRoyalFlush(hand) {  
    const isFlush = areAllSameSuit(hand)
    const isStraight = areStraight(hand)
    
    if (
      isFlush &&
      isStraight &&
      hand[0].number === 14
    ) {
      const handValue = [10]
      return handValue
    }
    return checkStraightFlush(hand)
  }

  function checkStraightFlush(hand) {
    const isFlush = areAllSameSuit(hand)
    const isStraight = areStraight(hand)
    
    if (
      isFlush &&
      isStraight
    ) {
      const handValue = [9,hand[0].number]
      return handValue
    }
    return check4OfAKind(hand)
  }

  function check4OfAKind(hand) {
    const set1 = hand.slice(0,4)
    const set2 = hand.slice(1)
    
    if (areSameNumber(set1)) {
      const handValue = [8, set1[0].number, hand[4].number]
      return handValue
    } else if (areSameNumber(set2)) {
      const handValue = [8, set2[0].number, hand[0].number]
      return handValue
    }
    return checkFullHouse(hand)
  }

  function checkFullHouse(hand) {
    const set1 = [hand.slice(0,3), hand.slice(3)]
    const set2 = [hand.slice(2), hand.slice(0,2)]

    if (areSameNumber(set1[0])) {
      if (areSameNumber(set1[1])) {
        const handValue = [7, set1[0][0].number, set1[1][0].number]
        return handValue
      }
    }
    if (areSameNumber(set2[0])) {
      if (areSameNumber(set2[1])) {
        const handValue = [7, set2[0][0].number, set2[1][0].number]
        return handValue
      }
    }
    return checkFlush(hand)
  }

  function checkFlush(hand) {
    if (areAllSameSuit(hand)) {
      const numbersArray = hand.map(card => card.number)
      const handValue = [6, ...numbersArray]
      return handValue
    }
    return checkStraight(hand)
  }

  function checkStraight(hand) {
    if (areStraight(hand)) {
      const handValue = [5, hand[0].number]
      return handValue
    }
    return check3OfAKind(hand)
  }

  function check3OfAKind(hand) {
    const set1 = hand.slice(0,3)
    const set2 = hand.slice(1,4)
    const set3 = hand.slice(2)

    if (areSameNumber(set1)) {
      const handValue = [4, set1[0].number, hand[3].number, hand[4].number]
      return handValue
    }
    if (areSameNumber(set2)) {
      const handValue = [4, set2[0].number, hand[0].number, hand[4].number]
      return handValue
    }
    if (areSameNumber(set3)) {
      const handValue = [4, set3[0].number, hand[0].number, hand[1].number]
      return handValue
    }
    return check2Pair(hand)
  }

  function check2Pair(hand) {
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

    if (pairs.length === 2) {
      const handValue = [3, ...pairs, single]
      return handValue
    }
    return checkPair(hand)
  }

  function checkPair(hand) {
    const set1 = [hand.slice(0,2), hand.slice(2)]
    const set2 = [hand.slice(1,3), [hand[0].number, hand[3], hand[4]]]
    const set3 = [hand.slice(2,4), [hand[0], hand[1], hand[4]]]
    const set4 = [hand.slice(3), hand.slice(0,3)]

    if (areSameNumber(set1[0])) {
      const handValue = [2, set1[0][0].number, ...set1[1].map(card => card.number)]
      return handValue
    }
    if (areSameNumber(set2[0])) {
      const handValue = [2, set2[0][0].number, ...set2[1].map(card => card.number)]
      return handValue
    }
    if (areSameNumber(set3[0])) {
      const handValue = [2, set3[0][0].number, ...set3[1].map(card => card.number)]
      return handValue
    }
    if (areSameNumber(set4[0])) {
      const handValue = [2, set4[0][0].number, ...set4[1].map(card => card.number)]
      return handValue
    }

    // If no pair, return high cards
    const handValue = [...hand.map(card => card.number)]
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
}






