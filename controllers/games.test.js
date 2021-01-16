const {calculateHandValue, calculateHandValues} = require('./games')

testBoard = [{"_id":"6003439c041a1f0004096b40","suit":"S","number":2},{"_id":"6003439c041a1f0004096b2b","suit":"C","number":9},{"_id":"6003439c041a1f0004096b41","suit":"D","number":3},{"_id":"6003439c041a1f0004096b35","suit":"S","number":12},{"_id":"6003439c041a1f0004096b3e","suit":"C","number":2},{"_id":"6003439c041a1f0004096b2a","suit":"C","number":13},{"_id":"6003439c041a1f0004096b3c","suit":"C","number":11},{"_id":"6003439c041a1f0004096b3b","suit":"C","number":14},{"_id":"6003439c041a1f0004096b31","suit":"H","number":12},{"_id":"6003439c041a1f0004096b34","suit":"H","number":13},{"_id":"6003439c041a1f0004096b37","suit":"D","number":4},{"_id":"6003439c041a1f0004096b3f","suit":"S","number":9},{"suit":"D","number":10},{"_id":"6003439c041a1f0004096b3d","suit":"H","number":4},{"_id":"6003439c041a1f0004096b3a","suit":"H","number":5},{"_id":"6003439c041a1f0004096b2d","suit":"S","number":4},{"_id":"6003439c041a1f0004096b36","suit":"H","number":9},{"_id":"6003439c041a1f0004096b2f","suit":"H","number":10},{"_id":"6003439c041a1f0004096b33","suit":"C","number":12},{"_id":"6003439c041a1f0004096b32","suit":"H","number":6},{"_id":"6003439c041a1f0004096b2e","suit":"D","number":14},{"_id":"6003439c041a1f0004096b39","suit":"H","number":14},{"_id":"6003439c041a1f0004096b2c","suit":"C","number":10},{"_id":"6003439c041a1f0004096b30","suit":"S","number":5},{"_id":"6003439c041a1f0004096b38","suit":"H","number":8}]

test('Test board in calculateHandValues', () => {
  expect(calculateHandValues(
    testBoard, 
    [
      [0,5,10,15,20],
      [1,6,11,16,21],
      [2,7,12,17,22],
      [3,8,13,18,23],
      [4,9,14,19,24]
    ]
  )).toEqual([
    [2, 4, 14, 13, 2],
    [4, 9, 14, 11],
    [4, 10, 14, 3],
    [4, 12, 5, 4],
    [1, 13, 8, 6, 5, 2]
  ])
})

test('Test board in calculateHandValues', () => {
  expect(calculateHandValues(
    testBoard, 
    [
      [20,21,22,23,24],
      [15,16,17,18,19],
      [10,11,12,13,14],
      [5,6,7,8,9],
      [0,1,2,3,4]
    ]
  )).toEqual([
    [2, 14, 10, 8, 5],
    [1, 12, 10, 9, 6, 4],
    [2, 4, 10, 9, 5],
    [2, 13, 14, 12, 11],
    [2, 2, 12, 9, 3]
  ])
})

test('Royal flush should return [10]', () => {
  expect(calculateHandValue([
    {number: 14, suit: 'S'},
    {number: 13, suit: 'S'},
    {number: 12, suit: 'S'},
    {number: 11, suit: 'S'},
    {number: 10, suit: 'S'}
  ])).toEqual([10])
})

test('Straight Flush should return [9, (highest card)]', () => {
  expect(calculateHandValue([
    {number: 13, suit: 'S'},
    {number: 12, suit: 'S'},
    {number: 11, suit: 'S'},
    {number: 10, suit: 'S'},
    {number: 9, suit: 'S'}
  ])).toEqual([9,13])
})

test('4 Of A Kind should return [8,(set card),(high card)]', () => {
  expect(calculateHandValue([
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 7, suit: 'S'}
  ])).toEqual([8,9,7])
})

test('4 Of A Kind should return [8,(set card),(high card)]', () => {
  expect(calculateHandValue([
    {number: 10, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'}
  ])).toEqual([8,9,10])
})

test('Full House should return [7,(3 set card),(2 set card)]', () => {
  expect(calculateHandValue([
    {number: 10, suit: 'S'},
    {number: 10, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'}
  ])).toEqual([7,9,10])
})

test('Flush should return [6,(5 numbers ranked descending)]', () => {
  expect(calculateHandValue([
    {number: 13, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 6, suit: 'S'},
    {number: 4, suit: 'S'},
    {number: 2, suit: 'S'}
  ])).toEqual([6,13,9,6,4,2])
})

test('Straight should return [5,(high card)]', () => {
  expect(calculateHandValue([
    {number: 7, suit: 'S'},
    {number: 6, suit: 'C'},
    {number: 5, suit: 'S'},
    {number: 4, suit: 'D'},
    {number: 3, suit: 'S'}
  ])).toEqual([5,7])
})

test('3 Of A Kind should return [4,(set card),(high card),(next high card)]', () => {
  expect(calculateHandValue([
    {number: 12, suit: 'S'},
    {number: 7, suit: 'C'},
    {number: 7, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 5, suit: 'S'}
  ])).toEqual([4,7,12,5])
})

test('3 Of A Kind should return [4,(set card),(high card),(next high card)]', () => {
  expect(calculateHandValue([
    {number: 7, suit: 'S'},
    {number: 7, suit: 'C'},
    {number: 7, suit: 'S'},
    {number: 5, suit: 'D'},
    {number: 2, suit: 'S'}
  ])).toEqual([4,7,5,2])
})

test('3 Of A Kind should return [4,(set card),(high card),(next high card)]', () => {
  expect(calculateHandValue([
    {number: 12, suit: 'S'},
    {number: 10, suit: 'C'},
    {number: 7, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 7, suit: 'S'}
  ])).toEqual([4,7,12,10])
})

test('2 Pair should return [3,(high set),(low set),(high card)]', () => {
  expect(calculateHandValue([
    {number: 12, suit: 'S'},
    {number: 10, suit: 'C'},
    {number: 10, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 7, suit: 'S'}
  ])).toEqual([3,10,7,12])
})

test('2 Pair should return [3,(high set),(low set),(high card)]', () => {
  expect(calculateHandValue([
    {number: 10, suit: 'S'},
    {number: 10, suit: 'C'},
    {number: 8, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 7, suit: 'S'}
  ])).toEqual([3,10,7,8])
})

test('Pair should return [2,(set),(ranked high cards)]', () => {
  expect(calculateHandValue([
    {number: 11, suit: 'S'},
    {number: 10, suit: 'C'},
    {number: 8, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 7, suit: 'S'}
  ])).toEqual([2,7,11,10,8])
})

test('Pair should return [2,(set),(ranked high cards)]', () => {
  expect(calculateHandValue([
    {number: 14, suit: 'C'},
    {number: 13, suit: 'C'},
    {number: 13, suit: 'H'},
    {number: 12, suit: 'H'},
    {number: 11, suit: 'C'}
  ])).toEqual([2, 13, 14, 12, 11])
})

test('High card should return [1,(ranked high cards)]', () => {
  expect(calculateHandValue([
    {number: 11, suit: 'S'},
    {number: 10, suit: 'C'},
    {number: 8, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 2, suit: 'S'}
  ])).toEqual([1,11,10,8,7,2])
})