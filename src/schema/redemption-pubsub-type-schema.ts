import { createModule, gql } from 'graphql-modules'
import TwitchClients from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'
import asyncify from 'callback-to-async-iterator'

export const RedemptionPubSubResolvers = {
  Subscription: {
    newRedemption: {
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
        const curriedOnRedemption = (cb: any) =>
          pubSubClient.onRedemption(myId, cb)

        const asyncified = asyncify(curriedOnRedemption)

        return asyncified
      },
      resolve: (redemption: any) => {
        return redemption
      },
    },
  },
}

export const RedemptionPubSubSchema = gql`
  type Redemption {
    userId: String
    id: String
    channelId: String
    userName: String
    userDisplayName: String
    redemptionDate: String
    rewardId: String
    rewardName: String
    rewardPrompt: String
    rewardCost: Int
    rewardIsQueued: String
    rewardImage: String
    message: String
    status: String
  }

  extend type Subscription {
    newRedemption: Redemption
  }
`

export const RedemptionPubSubModule = createModule({
  id: `redemption-pubsub-module`,
  dirname: __dirname,
  providers: [TwitchId, UserId],
  typeDefs: RedemptionPubSubSchema,
  resolvers: RedemptionPubSubResolvers,
})
