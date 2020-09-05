import { createModule, gql } from 'graphql-modules'
import { HelixUser, HelixStream } from 'twitch/lib'

export const StreamResolvers = {
  User: {
    async stream(user: HelixUser) {
      return await user.getStream()
    },
  },
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
    async user(stream: HelixStream) {
      return await stream.getUser()
    },
  },
}

export const StreamModule = createModule({
  id: `stream-module`,
  dirname: __dirname,
  typeDefs: gql`
    type Stream {
      language: String!
      gameId: String!
      id: String!
      title: String!
      viewers: Int!
      thumbnailUrl: String!
      userDisplayName: String!
      userId: String!

      user: User
    }

    extend type User {
      stream: Stream
    }
  `,
  resolvers: StreamResolvers,
})
