import { createModule, gql } from 'graphql-modules'
import { HelixStream, HelixGame } from 'twitch/lib'

export const GameResolvers = {
  Stream: {
    async game(stream: HelixStream) {
      return await stream.getGame()
    },
  },
  Game: {
    id(game: HelixGame) {
      return game.id
    },
    name(game: HelixGame) {
      return game.name
    },
    boxArtUrl(game: HelixGame) {
      return game.boxArtUrl
    },
  },
}

export const GameSchema = gql`
  type Game {
    boxArtUrl: String!
    id: String!
    name: String!
  }

  extend type Stream {
    game: Game
  }
`

export const GameModule = createModule({
  id: `game-module`,
  dirname: __dirname,
  typeDefs: GameSchema,
  resolvers: GameResolvers,
})
