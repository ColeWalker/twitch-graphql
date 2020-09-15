import { createModule, gql } from 'graphql-modules'
import { HelixStream, HelixUser } from 'twitch'

export const StreamUserLinkResolvers = {
  Stream: {
    async user(stream: HelixStream) {
      return await stream.getUser()
    },
  },
  User: {
    async stream(user: HelixUser) {
      return await user.getStream()
    },
  },
}

export const StreamUserLinkSchema = gql`
  extend type User {
    stream: Stream
  }
  extend type Stream {
    user: User
  }
`

export const StreamUserLinkModule = createModule({
  id: `stream-user-link-module`,
  dirname: __dirname,
  typeDefs: StreamUserLinkSchema,
  resolvers: StreamUserLinkResolvers,
})
