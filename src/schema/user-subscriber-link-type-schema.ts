import { gql, createModule } from 'graphql-modules'
import { ApiClient, HelixSubscription, HelixUser } from 'twitch'
import RefreshToken from '../helpers/RefreshToken'

export const UserSubscriberLinkResolvers = {
  Subscriber: {
    async user(sub: HelixSubscription) {
      return await sub.getUser()
    },
  },
  User: {
    async getSubscriptionToId(user: HelixUser, args: { userId: string }) {
      return await user.getSubscriptionTo(args.userId)
    },
    async getSubscriptionToDisplayName(
      user: HelixUser,
      args: { displayName: string },
      { user_id, secret, refresh_token }: GraphQLModules.ModuleContext
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })

      const subscribed = await twitchClient.helix.users.getUserByName(
        args.displayName
      )

      return !!subscribed && user.getSubscriptionTo(subscribed.id)
    },
    async isSubscribedToId(user: HelixUser, args: { userId: string }) {
      return await user.isSubscribedTo(args.userId)
    },
    async isSubscribedToDisplayName(
      user: HelixUser,
      args: { displayName: string },
      { user_id, secret, refresh_token }: GraphQLModules.ModuleContext
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })

      const subscribed = await twitchClient.helix.users.getUserByName(
        args.displayName
      )

      return !!subscribed && user.isSubscribedTo(subscribed.id)
    },
  },
}

export const UserSubscriberLinkSchema = gql`
  extend type Subscriber {
    user: User!
  }

  extend type User {
    isSubscribedToId(userId: String!): Boolean!
    isSubscribedToDisplayName(displayName: String!): Boolean!

    getSubscriptionToId(userId: String!): Subscriber
    getSubscriptionToDisplayName(displayName: String!): Subscriber
  }
`
export const UserSubscriberLinkModule = createModule({
  id: `user-subscriber-link-module`,
  dirname: __dirname,
  typeDefs: UserSubscriberLinkSchema,
  resolvers: UserSubscriberLinkResolvers,
})
