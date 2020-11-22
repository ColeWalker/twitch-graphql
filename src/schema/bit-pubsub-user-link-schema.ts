import { createModule, gql } from 'graphql-modules'
import { PubSubBitsMessage } from 'twitch-pubsub-client'
import { ApiClient } from 'twitch'
import RefreshToken from '../helpers/RefreshToken'
export const BitUserLinkResolvers = {
  Bit: {
    user: async (
      bit: PubSubBitsMessage,
      _args: any,
      { user_id, secret, refresh_token }: GraphQLModules.Context
    ) => {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })

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
  typeDefs: BitUserLinkSchema,
  resolvers: BitUserLinkResolvers,
})
