const {checkHand} = require('./games')

test('Royal flush should return [10]', () => {
  expect(checkHand([
    {number: 14, suit: 'S'},
    {number: 11, suit: 'S'},
    {number: 12, suit: 'S'},
    {number: 10, suit: 'S'},
    {number: 13, suit: 'S'}
  ])).toEqual([10])
})

test('Straight Flush should return [9, (highest card)]', () => {
  expect(checkHand([
    {number: 9, suit: 'S'},
    {number: 11, suit: 'S'},
    {number: 12, suit: 'S'},
    {number: 10, suit: 'S'},
    {number: 13, suit: 'S'}
  ])).toEqual([9,13])
})

test('4 Of A Kind should return [8,(set card),(high card)]', () => {
  expect(checkHand([
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 7, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'}
  ])).toEqual([8,9,7])
})

test('4 Of A Kind should return [8,(set card),(high card)]', () => {
  expect(checkHand([
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 10, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'}
  ])).toEqual([8,9,10])
})

test('Full House should return [7,(3 set card),(2 set card)]', () => {
  expect(checkHand([
    {number: 9, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 10, suit: 'S'},
    {number: 9, suit: 'S'},
    {number: 10, suit: 'S'}
  ])).toEqual([7,9,10])
})

test('Flush should return [6,(5 numbers ranked descending)]', () => {
  expect(checkHand([
    {number: 9, suit: 'S'},
    {number: 6, suit: 'S'},
    {number: 4, suit: 'S'},
    {number: 2, suit: 'S'},
    {number: 13, suit: 'S'}
  ])).toEqual([6,13,9,6,4,2])
})

test('Straight should return [5,(high card)]', () => {
  expect(checkHand([
    {number: 3, suit: 'S'},
    {number: 6, suit: 'C'},
    {number: 4, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 5, suit: 'S'}
  ])).toEqual([5,7])
})

test('3 Of A Kind should return [4,(set card),(high card),(next high card)]', () => {
  expect(checkHand([
    {number: 7, suit: 'S'},
    {number: 12, suit: 'C'},
    {number: 7, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 5, suit: 'S'}
  ])).toEqual([4,7,12,5])
})

test('3 Of A Kind should return [4,(set card),(high card),(next high card)]', () => {
  expect(checkHand([
    {number: 7, suit: 'S'},
    {number: 2, suit: 'C'},
    {number: 7, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 5, suit: 'S'}
  ])).toEqual([4,7,5,2])
})

test('3 Of A Kind should return [4,(set card),(high card),(next high card)]', () => {
  expect(checkHand([
    {number: 7, suit: 'S'},
    {number: 12, suit: 'C'},
    {number: 7, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 10, suit: 'S'}
  ])).toEqual([4,7,12,10])
})

test('2 Pair should return [3,(high set),(low set),(high card)]', () => {
  expect(checkHand([
    {number: 7, suit: 'S'},
    {number: 12, suit: 'C'},
    {number: 10, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 10, suit: 'S'}
  ])).toEqual([3,10,7,12])
})

test('2 Pair should return [3,(high set),(low set),(high card)]', () => {
  expect(checkHand([
    {number: 7, suit: 'S'},
    {number: 8, suit: 'C'},
    {number: 10, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 10, suit: 'S'}
  ])).toEqual([3,10,7,8])
})

test('Pair should return [2,(set),(ranked high cards)]', () => {
  expect(checkHand([
    {number: 7, suit: 'S'},
    {number: 8, suit: 'C'},
    {number: 11, suit: 'S'},
    {number: 7, suit: 'D'},
    {number: 10, suit: 'S'}
  ])).toEqual([2,7,11,10,8])
})

test('High card should return [1,(ranked high cards)]', () => {
  expect(checkHand([
    {number: 7, suit: 'S'},
    {number: 8, suit: 'C'},
    {number: 11, suit: 'S'},
    {number: 2, suit: 'D'},
    {number: 10, suit: 'S'}
  ])).toEqual([11,10,8,7,2])
})