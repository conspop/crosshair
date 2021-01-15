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