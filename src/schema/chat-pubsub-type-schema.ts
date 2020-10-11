import { createModule, gql } from 'graphql-modules'
import TwitchClients from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'
import asyncify from 'callback-to-async-iterator'
import { ChatClient } from 'twitch-chat-client'

export interface Chat {
  channel: string
  displayName: string
  message: string
}

export const ChatPubSubResolvers = {
  Subscription: {
    newChat: {
      subscribe: async (
        _: any,
        args: { channel: string },
        { injector }: GraphQLModules.Context
      ) => {
        const clients = TwitchClients

        const chatClient = new ChatClient(await clients.authProvider(), {
          channels: [args.channel],
        })
        await chatClient.connect()

        const curriedOnChat = async (cb: any) =>
          chatClient.onMessage(async (channel, user, message) => {
            return cb({ channel, displayName: user, message })
          })

        const asyncified = asyncify(curriedOnChat)

        return asyncified
      },
      resolve: (chat: any) => {
        return chat
      },
    },
  },
}

export const ChatPubSubSchema = gql`
  type Chat {
    message: String
    displayName: String
    channel: String
  }

  extend type Subscription {
    newChat(channel: String!): Chat
  }
`

export const ChatPubSubModule = createModule({
  id: `chat-pubsub-module`,
  dirname: __dirname,
  providers: [TwitchId, UserId],
  typeDefs: ChatPubSubSchema,
  resolvers: ChatPubSubResolvers,
})
