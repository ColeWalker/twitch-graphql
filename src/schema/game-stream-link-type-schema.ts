import { gql, createModule } from 'graphql-modules'
import { HelixStream } from 'twitch'

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
  typeDefs: GameStreamLinkSchema,
  resolvers: GameStreamLinkResolvers,
})
