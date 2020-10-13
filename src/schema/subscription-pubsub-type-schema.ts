import { createModule, gql } from 'graphql-modules'
import TwitchClients from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'
import asyncify from 'callback-to-async-iterator'

export const SubscriptionPubSubResolvers = {
  Subscription: {
    newSubscription: {
      subscribe: async (
        _: any,
        _args: any,
        { injector }: GraphQLModules.Context
      ) => {
        const clients = TwitchClients

        const twitchClient = await clients.apiClient()
        const myId = (await twitchClient.getTokenInfo()).userId
        const pubSubClient = await clients.pubSubClient()
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
  providers: [TwitchId, UserId],
  typeDefs: SubscriptionPubSubSchema,
  resolvers: SubscriptionPubSubResolvers,
})
