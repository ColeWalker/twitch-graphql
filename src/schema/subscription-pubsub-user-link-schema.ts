import { createModule, gql } from 'graphql-modules'
import { PubSubSubscriptionMessage } from 'twitch-pubsub-client'
import { TwitchClients } from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'

export const SubscriptionPubSubUserLinkResolvers = {
  SubscriptionMessage: {
    user: async (
      subscriptionMessage: PubSubSubscriptionMessage,
      _args: any,
      { injector }: GraphQLModules.Context
    ) => {
      const clients = injector.get(TwitchClients)
      const twitchClient = await clients.apiClient()

      return twitchClient.helix.users.getUserById(subscriptionMessage.userId)
    },
    gifterUser: async (
      subscriptionMessage: PubSubSubscriptionMessage,
      _args: any,
      { injector }: GraphQLModules.Context
    ) => {
      const clients = injector.get(TwitchClients)
      const twitchClient = await clients.apiClient()

      return twitchClient.helix.users.getUserById(
        subscriptionMessage.gifterId || ''
      )
    },
  },
}

export const SubscriptionPubSubUserLinkSchema = gql`
  extend type SubscriptionMessage {
    user: User
    gifterUser: User
  }
`

export const SubscriptionPubSubUserLinkModule = createModule({
  id: `subscription-pubsub-user-link-module`,
  dirname: __dirname,
  providers: [TwitchClients, TwitchId, UserId],
  typeDefs: SubscriptionPubSubUserLinkSchema,
  resolvers: SubscriptionPubSubUserLinkResolvers,
})
