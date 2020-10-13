import { createModule, gql } from 'graphql-modules'
import { ApiClient } from 'twitch/lib'
import RefreshToken from '../helpers/RefreshToken'

import { Chat } from './chat-pubsub-type-schema'

export const ChatUserLinkResolvers = {
  Chat: {
    user: async (
      chat: Chat,
      _args: any,
      { user_id, secret, refresh_token }: GraphQLModules.Context
    ) => {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })

      return twitchClient.helix.users.getUserByName(chat.displayName)
    },
  },
}

export const ChatUserLinkSchema = gql`
  extend type Chat {
    user: User
  }
`

export const ChatUserLinkModule = createModule({
  id: `chat-pubsub-user-link-module`,
  dirname: __dirname,
  typeDefs: ChatUserLinkSchema,
  resolvers: ChatUserLinkResolvers,
})
