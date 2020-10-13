import { createModule, gql } from 'graphql-modules'
import { PubSubRedemptionMessage } from 'twitch-pubsub-client/lib'
import { ApiClient } from 'twitch/lib'
import RefreshToken from '../helpers/RefreshToken'

export const RedemptionUserLinkResolvers = {
  Redemption: {
    user: async (
      redemption: PubSubRedemptionMessage,
      _args: any,
      { user_id, secret, refresh_token }: GraphQLModules.Context
    ) => {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })

      return twitchClient.helix.users.getUserById(redemption.userId)
    },
    channelRedeemedAt: async (
      redemption: PubSubRedemptionMessage,
      _args: any,
      { user_id, secret, refresh_token }: GraphQLModules.Context
    ) => {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })

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
  typeDefs: RedemptionUserLinkSchema,
  resolvers: RedemptionUserLinkResolvers,
})
