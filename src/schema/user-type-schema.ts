import { createModule, gql } from 'graphql-modules'
import { HelixSubscription } from 'twitch/lib'

const UserResolvers = {
  Subscriber: {
    async user(
      sub: HelixSubscription,
      args: {},
      { injector }: GraphQLModules.ModuleContext
    ) {},
  },
  User: {},
}
export const UserModule = createModule({
  id: `user-module`,
  dirname: __dirname,
  typeDefs: gql`
    type User {
      displayName: String!
      description: String!
      id: String!
      profilePictureURL: String!
      view: Int!

      # stream: Stream
    }

    extend type Subscriber {
      user: User!
    }
  `,
  resolvers: UserResolvers,
})
