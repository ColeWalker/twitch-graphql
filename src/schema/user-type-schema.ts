import { createModule, gql } from 'graphql-modules'
import { HelixFollow, HelixSubscription, HelixUser } from 'twitch/lib'
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
      HelixFollow
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
    async getFollowToId(user: HelixUser, args: { userId: string }) {
      return user.getFollowTo(args.userId)
    },
    async getFollowToDisplayName(
      user: HelixUser,
      args: { displayName: string },
      { injector }: GraphQLModules.ModuleContext
    ) {
      const clients = await injector.get(TwitchClients)
      const apiClient = await clients.apiClient()

      const followed = await apiClient.helix.users.getUserByName(
        args.displayName
      )

      return followed && user.getFollowTo(followed.id)
    },
    async followsId(user: HelixUser, args: { userId: string }) {
      return user.follows(args.userId)
    },
    async followsDisplayName(
      user: HelixUser,
      args: { displayName: string },
      { injector }: GraphQLModules.ModuleContext
    ) {
      const clients = await injector.get(TwitchClients)
      const apiClient = await clients.apiClient()

      const followed = await apiClient.helix.users.getUserByName(
        args.displayName
      )

      return !!followed && user.follows(followed.id)
    },
  },
  Follow: {
    followDate(follow: HelixFollow) {
      return follow.followDate.toDateString()
    },
    followDateUTC(follow: HelixFollow) {
      return follow.followDate
    },
    async followerUser(follow: HelixFollow) {
      return await follow.getUser()
    },
    async followedUser(follow: HelixFollow) {
      return await follow.getFollowedUser()
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

    getFollowToId(userId: String!): Follow
    getFollowToDisplayName(displayName: String!): Follow

    followsId(userId: String!): Boolean!
    followsDisplayName(displayName: String!): Boolean!
  }

  type Follow {
    followDateUTC: String!
    followDate: String!
    followerUser: User!
    followedUser: User!
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
