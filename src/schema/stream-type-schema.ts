import { createModule, gql } from 'graphql-modules'
import { HelixStream } from 'twitch/lib'

export const StreamResolvers = {
  Stream: {
    language(stream: HelixStream) {
      return stream.language
    },
    gameId(stream: HelixStream) {
      return stream.gameId
    },
    id(stream: HelixStream) {
      return stream.id
    },
    title(stream: HelixStream) {
      return stream.title
    },
    viewers(stream: HelixStream) {
      return stream.viewers
    },
    thumbnailUrl(stream: HelixStream) {
      return stream.thumbnailUrl
    },
    userDisplayName(stream: HelixStream) {
      return stream.userDisplayName
    },
    userId(stream: HelixStream) {
      return stream.userId
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
`

export const StreamModule = createModule({
  id: `stream-module`,
  dirname: __dirname,
  typeDefs: StreamSchema,
  resolvers: StreamResolvers,
})
