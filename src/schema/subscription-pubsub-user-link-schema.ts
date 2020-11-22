import { createModule, gql } from 'graphql-modules'
import { PubSubSubscriptionMessage } from 'twitch-pubsub-client'
import { ApiClient } from 'twitch'
import RefreshToken from '../helpers/RefreshToken'

export const SubscriptionPubSubUserLinkResolvers = {
  SubscriptionMessage: {
    user: async (
      subscriptionMessage: PubSubSubscriptionMessage,
      _args: any,
      { user_id, secret, refresh_token }: GraphQLModules.Context
    ) => {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })

      return twitchClient.helix.users.getUserById(subscriptionMessage.userId)
    },
    gifterUser: async (
      subscriptionMessage: PubSubSubscriptionMessage,
      _args: any,
      { user_id, secret, refresh_token }: GraphQLModules.Context
    ) => {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })

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
  typeDefs: SubscriptionPubSubUserLinkSchema,
  resolvers: SubscriptionPubSubUserLinkResolvers,
})
