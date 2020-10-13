import { createModule, gql } from 'graphql-modules'
import { HelixFollow, HelixFollowData, HelixUser } from 'twitch'
import { ApiClient } from 'twitch'
import RefreshToken from '../helpers/RefreshToken'

export const UserResolvers = {
  Query: {
    async getUserByDisplayName(
      _parent: {},
      args: { displayName: string },
      { user_id, secret, refresh_token }: Partial<GraphQLModules.ModuleContext>
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })

      return twitchClient.helix.users.getUserByName(args.displayName)
    },
    async getUserById(
      _parent: {},
      args: { userId: string },
      { user_id, secret, refresh_token }: Partial<GraphQLModules.ModuleContext>
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })

      return twitchClient.helix.users.getUserById(args.userId)
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
      return await user.getFollowTo(args.userId)
    },
    async getFollowToDisplayName(
      user: HelixUser,
      args: { displayName: string },
      { user_id, secret, refresh_token }: Partial<GraphQLModules.ModuleContext>
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider })

      const followed = await twitchClient.helix.users.getUserByName(
        args.displayName
      )

      return followed && (await user?.getFollowTo(followed.id))
    },
    async followsId(user: HelixUser, args: { userId: string }) {
      return user.follows(args.userId)
    },
    async followsDisplayName(
      user: HelixUser,
      args: { displayName: string },
      { user_id, secret, refresh_token }: Partial<GraphQLModules.ModuleContext>
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })

      const followed = await twitchClient.helix.users.getUserByName(
        args.displayName
      )

      return !!followed && user.follows(followed.id)
    },
    async follows(
      user: HelixUser,
      args: { maxPages: number },
      { user_id, secret, refresh_token }: Partial<GraphQLModules.ModuleContext>
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })
      const page = await twitchClient.helix.users.getFollowsPaginated({
        user: user,
      })

      let pages: HelixFollowData[] = []
      if (page.current) pages.push(...page.current)
      for (let i = 1; i <= args.maxPages; i++) {
        await page.getNext()
        if (page.current) pages.push(...page.current)
      }

      return {
        nodes: pages.map((el) => new HelixFollow(el, twitchClient)),
        cursor: page.currentCursor,
        total: await page.getTotalCount(),
      }
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

    follows(maxPages: Int!): FollowConnection

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

  type FollowConnection {
    total: Int!
    nodes: [Follow]
    cursor: String
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
  resolvers: UserResolvers,
})
