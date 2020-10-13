import { createModule, gql } from 'graphql-modules'
import asyncify from 'callback-to-async-iterator'
import RefreshToken from '../helpers/RefreshToken'
import { ApiClient } from 'twitch'
import { PubSubClient } from 'twitch-pubsub-client'

export const BitPubSubResolvers = {
  Subscription: {
    newBits: {
      subscribe: async (
        _: any,
        _args: any,
        { user_id, refresh_token, secret }: GraphQLModules.Context
      ) => {
        const authProvider = await RefreshToken(user_id, secret, refresh_token)
        const twitchClient = new ApiClient({ authProvider, preAuth: true })
        const myId = (await twitchClient.getTokenInfo()).userId
        const pubSubClient = new PubSubClient()
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
  typeDefs: BitPubSubSchema,
  resolvers: BitPubSubResolvers,
})
