import * as assert from 'assert'
import { Game, State, Player, 差し入れ, 政治献金 } from '../src/election'

describe('Game', () => {
  it('正常に初期状態が構築されている', () => {
    const game = new Game()
    const actual = game.state$.getValue()
    const expect: State = {
      players: [new Player('しめにゃん', [差し入れ]), new Player('ちょろの', [差し入れ])],
      山札: [差し入れ, 差し入れ, 政治献金, 差し入れ, 差し入れ],
      turn: 0,
      行動回数: 0,
    }
    assert.deepStrictEqual(actual, expect)
  })
})

describe('ターン制御', () => {
  it('行動回数を2回にしたらターンが変わる', () => {
    const game = new Game()
    const state = game.state$.getValue()    
    state.行動回数 = 2
    game.state$.next(state)
    assert(game.state$.getValue().turn === 1)
  })
})

describe('Game#start', () => {
  it('start直後は行動回数0でターンも0', () => {
    const game = new Game()
    game.start()
    const state = game.state$.getValue()
    assert(state.行動回数 === 0)
    assert(state.turn === 0)
  })
})
