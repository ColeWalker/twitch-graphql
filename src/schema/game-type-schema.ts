import { createModule, gql } from 'graphql-modules'
import { HelixGame } from 'twitch/lib'
import TwitchClient from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'

export const GameResolvers = {
  Query: {
    async getGameByName(
      _parent: {},
      args: { gameName: string },
      { injector }: GraphQLModules.ModuleContext
    ) {
      const apiClient = await TwitchClient.apiClient()

      return await apiClient.helix.games.getGameByName(args.gameName)
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

  extend type Query {
    getGameByName(gameName: String!): Game
  }
`

export const GameModule = createModule({
  id: `game-module`,
  dirname: __dirname,
  providers: [TwitchId, UserId],
  typeDefs: GameSchema,
  resolvers: GameResolvers,
})
