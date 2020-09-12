import { createModule, gql } from 'graphql-modules'
import { HelixSubscription, HelixUser } from 'twitch/lib'
import { TwitchClients } from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'

export const UserResolvers = {
  Subscriber: {
    async user(sub: HelixSubscription) {
      return await sub.getUser()
    },
  },
  Query: {
    async getUserByDisplayName(
      _parent: {},
      args: { displayName: string },
      { injector }: GraphQLModules.ModuleContext
    ) {
      const clients = await injector.get(TwitchClients)
      const apiClient = await clients.apiClient()

      return apiClient.helix.users.getUserByName(args.displayName)
    },
    async getUserById(
      _parent: {},
      args: { userId: string },
      { injector }: GraphQLModules.ModuleContext
    ) {
      const clients = await injector.get(TwitchClients)
      const apiClient = await clients.apiClient()

      return apiClient.helix.users.getUserById(args.userId)
    },
  },
  User: {
    displayName(user: HelixUser) {
      return user.displayName
    },
    description(user: HelixUser) {
      return user.description
    },
    id(user: HelixUser) {
      return user.id
    },
    profilePictureURL(user: HelixUser) {
      return user.profilePictureUrl
    },
    views(user: HelixUser) {
      return user.views
    },
  },
}

export const UserSchema = gql`
  type User {
    displayName: String!
    description: String!
    id: String!
    profilePictureURL: String!
    views: Int!
  }

  extend type Subscriber {
    user: User!
  }

  extend type Query {
    getUserById(userId: String!): User
    getUserByDisplayName(displayName: String!): User
  }
`

export const UserModule = createModule({
  id: `user-module`,
  dirname: __dirname,
  typeDefs: UserSchema,
  providers: [TwitchClients, TwitchId, UserId],
  resolvers: UserResolvers,
})
