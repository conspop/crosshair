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