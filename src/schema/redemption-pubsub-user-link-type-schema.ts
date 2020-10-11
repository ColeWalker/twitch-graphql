import { createModule, gql } from 'graphql-modules'
import { PubSubRedemptionMessage } from 'twitch-pubsub-client/lib'
import TwitchClients from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'

export const RedemptionUserLinkResolvers = {
  Redemption: {
    user: async (
      redemption: PubSubRedemptionMessage,
      _args: any,
      { injector }: GraphQLModules.Context
    ) => {
      const clients = TwitchClients
      const twitchClient = await clients.apiClient()

      return twitchClient.helix.users.getUserById(redemption.userId)
    },
    channelRedeemedAt: async (
      redemption: PubSubRedemptionMessage,
      _args: any,
      { injector }: GraphQLModules.Context
    ) => {
      const clients = TwitchClients
      const twitchClient = await clients.apiClient()

      return twitchClient.helix.users.getUserById(redemption.channelId)
    },
  },
}

export const RedemptionUserLinkSchema = gql`
  extend type Redemption {
    user: User
    channelRedeemedAt: User
  }
`

export const RedemptionUserLinkModule = createModule({
  id: `redemption-pubsub-user-link-module`,
  dirname: __dirname,
  providers: [TwitchId, UserId],
  typeDefs: RedemptionUserLinkSchema,
  resolvers: RedemptionUserLinkResolvers,
})
