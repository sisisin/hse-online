import * as readline from 'readline'
import { Subject } from 'rxjs/Subject'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Subscription } from 'rxjs/Subscription'

interface PlayCard {
  name: string
  type: CardType
}

export class Player {
  constructor(
    public playerName: string,
    public 手札: PlayCard[]
  ) { }
}

type CardType = '行動カード' | 'イベントカード'
export const 差し入れ: PlayCard = { name: '差し入れ', type: '行動カード' }
export const 政治献金: PlayCard = { name: '政治献金', type: 'イベントカード' }

export interface State {
  players: Player[]
  山札: PlayCard[]
  turn: number
  行動回数: number
}


export class Game {
  state$: BehaviorSubject<State>
  gameEnd$: Subject<State> = new Subject<State>()
  subs = new Subscription()

  constructor() {
    const 山札 = [差し入れ, 差し入れ, 政治献金, 差し入れ, 差し入れ]
    const players = [new Player('しめにゃん', [差し入れ]), new Player('ちょろの', [差し入れ])]
    const turn = 0
    this.state$ = new BehaviorSubject<State>({ 山札, players, turn, 行動回数: 0 })

    this.subs.add(this.state$.subscribe(state => {
      if (state.行動回数 === 2) { // ターン変更
        state.turn = state.turn === state.players.length - 1 ? 0 : state.turn + 1
        const [山札, player] = this.drawCard(state, state.players[state.turn])!
        state.山札 = 山札!
        state.players[state.turn] = player!
        state.行動回数 = 0
        this.state$.next(state)
      }
    }))
  }

  start() {
    const state = this.state$.getValue()
    state.turn = state.players.length - 1
    state.行動回数 = 2
    this.state$.next(state)
  }

  drawCard(state: State, targetPlayer: Player): [PlayCard[] | null, Player | null] {
    const card = state.山札.shift()!

    if (card === 政治献金 /* 終了条件 */) {
      this.gameEnd$.next(state)
      this.subs.unsubscribe()
      console.log('Game End!')
      console.log(this.toString())
      return [null, null]
    }

    targetPlayer.手札 = [...targetPlayer.手札, card]
    return [state.山札, targetPlayer]
  }

  execCommand(cmd: string) {
    switch (cmd) {
      case 'draw.山札': {
        console.log('draw.山札')
        const state = this.state$.getValue()
        const [山札, player] = this.drawCard(state, state.players[state.turn])
        state.山札 = 山札!
        state.players[state.turn] = player!
        state.行動回数 += 2
        this.state$.next(state)
        break
      }
      default:
        break
    }
  }

  toString() {
    return JSON.stringify(this.state$.getValue())
  }
}

export class Client {
  gameState$: BehaviorSubject<State>
  gameEnd$: Subject<State>
  constructor(private game: Game) {
    game.state$.subscribe(s => this.gameState$.next(s))
    game.gameEnd$.subscribe(s => this.gameEnd$.next(s))
  }

  execCommand(cmd: string) {
    this.game.execCommand(cmd)
  }
}
