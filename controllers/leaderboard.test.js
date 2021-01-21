const { createLeaderboardObjects } = require('./leaderboard')

const testUsers = [
  {
    games: [
      '600745cbe02ded0004d4f708',
      '60075cc4e02ded0004d4f788',
      '6008a639c024b10004d1aa06',
      '6008a8bb95e0038ecd634d45',
      '6008b1ee19b86d00045fad93',
      '600977b5e616fd0004a704f7',
      '60097ef04d7e1900049b4799',
      '60097f0d4d7e1900049b479c',
      '6009ac5705426000048dd5e2',
      '6009af8705426000048dd5e3'
    ],
    _id: '600743fee02ded0004d4f705',
    username: 'sebbbbby',
    password: '$2b$06$HodFZC/cIghBOWRxE70s/eXwAZetWiZNIzVBP9WwpkgwLFbZboD12',
    __v: 12,
    results: [{
      beginningELO: 1500,
      opponent: "Matty",
      isWin: false,
      endingELO: 1484
    }]
  },
  {
    games: [
      '600745cbe02ded0004d4f708',
      '600745dde02ded0004d4f723',
      '60074602e02ded0004d4f73e',
      '60074603e02ded0004d4f757'
    ],
    _id: '600745c6e02ded0004d4f707',
    username: 'Nickmack',
    password: '$2b$06$w4y8V6XkHA58bs6HPkBeyen7YjzX4rj2kI93IUEuBjeBWrWjY7q1y',
    __v: 4,
    results: []
  },
  {
    games: [
      '600745dde02ded0004d4f723',
      '60074602e02ded0004d4f73e',
      '60074603e02ded0004d4f757'
    ],
    _id: '600745d3e02ded0004d4f722',
    username: 'JNB',
    password: '$2b$06$D/0M744P0utHnYMU37tQoOdorxAZYCKoUXtqwIRhAF/96UGqcGKxu',
    __v: 3,
    results: []
  }
]

test('Create Leaderboard Objects', () => {
  expect(createLeaderboardObjects(testUsers))
  .toEqual([{
    name: 'sebbbbby',
    ELO: 1484,
    ELOChange: -16
  }])
})