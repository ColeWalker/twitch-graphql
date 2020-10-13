import { createModule, gql } from 'graphql-modules'
import asyncify from 'callback-to-async-iterator'
import { PubSubClient } from 'twitch-pubsub-client/lib'
import { ApiClient } from 'twitch/lib'
import RefreshToken from '../helpers/RefreshToken'

export const RedemptionPubSubResolvers = {
  Subscription: {
    newRedemption: {
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
  typeDefs: RedemptionPubSubSchema,
  resolvers: RedemptionPubSubResolvers,
})
