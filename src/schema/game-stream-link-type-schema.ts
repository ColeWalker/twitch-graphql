import { gql, createModule } from 'graphql-modules'
import { HelixStream } from 'twitch'
import { TwitchClients } from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'

export const GameStreamLinkResolvers = {
  Stream: {
    async game(stream: HelixStream) {
      return await stream.getGame()
    },
  },
}

export const GameStreamLinkSchema = gql`
  extend type Stream {
    game: Game
  }
`

export const GameStreamLinkModule = createModule({
  id: `game-stream-link-module`,
  dirname: __dirname,
  providers: [TwitchClients, TwitchId, UserId],
  typeDefs: GameStreamLinkSchema,
  resolvers: GameStreamLinkResolvers,
})
