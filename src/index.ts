import { Game } from './election'

async function main() {
  const game = new Game()
  game.start()
  game.execCommand('draw.山札')
}

main().catch(err => console.error(err))
