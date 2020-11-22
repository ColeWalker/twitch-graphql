import { createModule, gql } from 'graphql-modules'
import { ApiClient, HelixStream, HelixStreamData } from 'twitch'
import RefreshToken from '../helpers/RefreshToken'

export const StreamResolvers = {
  Query: {
    async getStreams(
      _parent: unknown,
      args: { streamFilter: any; maxPages: number },
      { user_id, secret, refresh_token }: Partial<GraphQLModules.ModuleContext>
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })

      let gameIds: string[] = []

      if (args?.streamFilter?.gameNames?.length) {
        gameIds = (
          await twitchClient.helix.games.getGamesByNames(
            args.streamFilter.gameNames
          )
        )?.map((x) => x.id)
      }

      const streamFilter: any = {
        ...args.streamFilter,
        game: args.streamFilter?.gameIds
          ? [...args.streamFilter?.gameIds, ...gameIds]
          : [...gameIds],
      }

      const page = twitchClient.helix.streams.getStreamsPaginated(streamFilter)

      let pages: HelixStreamData[] = []
      if (page.current) pages.push(...page.current)

      for (let i = 1; i <= args?.maxPages; i++) {
        await page.getNext()
        if (page.current) pages.push(...page.current)
      }

      return {
        nodes: pages.map((el) => new HelixStream(el, twitchClient)),
        cursor: page.currentCursor,
        total: pages?.length,
      }
    },
  },
}

export const StreamSchema = gql`
  type Stream {
    language: String!
    gameId: String!
    id: String!
    title: String!
    viewers: Int!
    thumbnailUrl: String!
    userDisplayName: String!
    userId: String!
  }

  type StreamConnection {
    total: Int!
    nodes: [Stream]
    cursor: String
  }

  extend type Query {
    getStreams(streamFilter: StreamFilter!, maxPages: Int = 1): StreamConnection
  }

  input StreamFilter {
    gameIds: [String]
    gameNames: [String]
    languages: [String]
    type: StreamType
    userIds: [String]
    userNames: [String]
  }

  enum StreamType {
    live
    none
  }
`

export const StreamModule = createModule({
  id: `stream-module`,
  dirname: __dirname,
  typeDefs: StreamSchema,
  resolvers: StreamResolvers,
})
