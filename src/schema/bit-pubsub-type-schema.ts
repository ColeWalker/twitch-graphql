import { createModule, gql } from 'graphql-modules'
import TwitchClients from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'
import asyncify from 'callback-to-async-iterator'

export const BitPubSubResolvers = {
  Subscription: {
    newBits: {
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

        const curriedOnBits = (cb: any) => pubSubClient.onBits(myId, cb)

        const asyncified = asyncify(curriedOnBits)

        return asyncified
      },
      resolve: (redemption: any) => {
        return redemption
      },
    },
  },
}

export const BitPubSubSchema = gql`
  type Bit {
    userId: String
    userName: String
    message: String
    bits: Int
    totalBits: Int
    isAnonymous: Boolean
  }

  extend type Subscription {
    newBits: Bit
  }
`

export const BitPubSubModule = createModule({
  id: `bit-pubsub-module`,
  dirname: __dirname,
  providers: [TwitchId, UserId],
  typeDefs: BitPubSubSchema,
  resolvers: BitPubSubResolvers,
})
