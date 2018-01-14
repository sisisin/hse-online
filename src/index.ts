import { Game, Client } from './election'

async function main() {
  const game = new Game()
  const client = new Client(game)
  game.start()
  client.execCommand('draw.山札')
}

main().catch(err => console.error(err))
