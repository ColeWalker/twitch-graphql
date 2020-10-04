import { createModule, gql } from 'graphql-modules'
import { TwitchClients } from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'
import { PubSubBitsMessage } from 'twitch-pubsub-client'
export const BitUserLinkResolvers = {
  Bit: {
    user: async (
      bit: PubSubBitsMessage,
      _args: any,
      { injector }: GraphQLModules.Context
    ) => {
      const clients = injector.get(TwitchClients)
      const twitchClient = await clients.apiClient()

      return twitchClient.helix.users.getUserById(bit.userId || '')
    },
  },
}

export const BitUserLinkSchema = gql`
  extend type Bit {
    user: User
  }
`

export const BitUserLinkModule = createModule({
  id: `bit-pubsub-user-link-module`,
  dirname: __dirname,
  providers: [TwitchClients, TwitchId, UserId],
  typeDefs: BitUserLinkSchema,
  resolvers: BitUserLinkResolvers,
})
