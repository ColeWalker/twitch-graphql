import { createModule, gql } from 'graphql-modules'
import { TwitchClients } from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'
import { Chat } from './chat-pubsub-type-schema'

export const ChatUserLinkResolvers = {
  Chat: {
    user: async (
      chat: Chat,
      _args: any,
      { injector }: GraphQLModules.Context
    ) => {
      const clients = injector.get(TwitchClients)
      const twitchClient = await clients.apiClient()

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
  providers: [TwitchClients, TwitchId, UserId],
  typeDefs: ChatUserLinkSchema,
  resolvers: ChatUserLinkResolvers,
})
