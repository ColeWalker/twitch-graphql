import { createModule, gql } from 'graphql-modules'
import asyncify from 'callback-to-async-iterator'
import { PubSubClient } from 'twitch-pubsub-client'
import { ApiClient } from 'twitch'
import RefreshToken from '../helpers/RefreshToken'

export const SubscriptionPubSubResolvers = {
  Subscription: {
    newSubscription: {
      subscribe: async (
        _: any,
        _args: any,
        { user_id, secret, refresh_token }: GraphQLModules.Context
      ) => {
        const authProvider = await RefreshToken(user_id, secret, refresh_token)
        const twitchClient = new ApiClient({ authProvider, preAuth: true })
        const myId = (await twitchClient.getTokenInfo()).userId
        const pubSubClient = new PubSubClient()

        await pubSubClient.registerUserListener(twitchClient)

        const curriedOnSubscription = (cb: any) =>
          pubSubClient.onSubscription(myId, cb)

        const asyncified = asyncify(curriedOnSubscription)

        return asyncified
      },
      resolve: (subscription: any) => {
        return subscription
      },
    },
  },
}

export const SubscriptionPubSubSchema = gql`
  type SubscriptionMessage {
    userId: String
    userName: String
    userDisplayName: String
    streakMonths: Int
    cumulativeMonths: Int
    months: Int
    time: String
    subPlan: String
    isResub: Boolean
    isGift: Boolean
    isAnonymous: Boolean
    gifterId: String
    gifterName: String
    gifterDisplayName: String
    giftDuration: Int
  }
  extend type Subscription {
    newSubscription: SubscriptionMessage
  }
`

export const SubscriptionPubSubModule = createModule({
  id: `subscription-pubsub-module`,
  dirname: __dirname,
  typeDefs: SubscriptionPubSubSchema,
  resolvers: SubscriptionPubSubResolvers,
})
