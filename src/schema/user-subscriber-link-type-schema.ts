import { gql, createModule } from 'graphql-modules'
import { HelixSubscription, HelixUser } from 'twitch'
import TwitchClients from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'

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
      { injector }: GraphQLModules.ModuleContext
    ) {
      const apiClient = await TwitchClients.apiClient()

      const subscribed = await apiClient.helix.users.getUserByName(
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
      { injector }: GraphQLModules.ModuleContext
    ) {
      const apiClient = await TwitchClients.apiClient()

      const subscribed = await apiClient.helix.users.getUserByName(
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
  providers: [TwitchId, UserId],
  resolvers: UserSubscriberLinkResolvers,
})
