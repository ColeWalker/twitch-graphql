import { createModule, gql } from 'graphql-modules'
import { ApiClient } from 'twitch'
import RefreshToken from '../helpers/RefreshToken'

export const GameResolvers = {
  Query: {
    async getGameByName(
      _parent: {},
      args: any,
      { user_id, secret, refresh_token }: Partial<GraphQLModules.ModuleContext>
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })
      const game = await twitchClient.helix.games.getGameByName(args.gameName)
      return game
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
  typeDefs: GameSchema,
  resolvers: GameResolvers,
})
