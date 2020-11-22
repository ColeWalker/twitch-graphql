import { createModule, gql } from 'graphql-modules'
import asyncify from 'callback-to-async-iterator'
import { ChatClient } from 'twitch-chat-client'
import RefreshToken, { rawToken } from '../helpers/RefreshToken'
import tmi from 'tmi.js'

export interface Chat {
  channel: string
  displayName: string
  message: string
}

export const ChatPubSubResolvers = {
  Subscription: {
    newChat: {
      subscribe: async (
        _: unknown,
        args: { channel: string },
        { user_id, secret, refresh_token }: GraphQLModules.Context
      ) => {
        const authProvider = await RefreshToken(user_id, secret, refresh_token)
        const chatClient = new ChatClient(authProvider, {
          channels: [args.channel],
        })
        await chatClient.connect()

        const curriedOnChat = async (cb: any) =>
          chatClient.onMessage(async (channel, user, message, msg) => {
            return cb({
              channel,
              displayName: user,
              message,
              userInfo: msg.userInfo,
            })
          })

        const asyncified = asyncify(curriedOnChat)

        return asyncified
      },
      resolve: (chat: any) => {
        return chat
      },
    },
  },
  Mutation: {
    sendChat: async (
      _: any,
      args: { channel: string; message: string },
      { user_id, secret, refresh_token, twitch_id }: GraphQLModules.Context
    ) => {
      const password = await rawToken(user_id, secret, refresh_token)

      try {
        const chatClient = tmi.Client({
          identity: { username: twitch_id, password },
          connection: {
            reconnect: true,
          },
          channels: [args.channel],
        })
        await chatClient.connect()
        await chatClient.say(args.channel, args.message)
        await chatClient.disconnect()
      } catch (err) {
        console.error(err)
        return false
      }

      return true
    },
  },
}

export const ChatPubSubSchema = gql`
  type Chat {
    message: String
    displayName: String
    channel: String
    userInfo: ChatUser
  }

  type ChatUser {
    userName: String
    displayName: String
    color: String
    userId: String
    userType: String
    isBroadcaster: Boolean
    isSubscriber: Boolean
    isFounder: Boolean
    isMod: Boolean
    isVip: Boolean
  }

  extend type Subscription {
    newChat(channel: String!): Chat
  }

  extend type Mutation {
    sendChat(channel: String!, message: String!): Boolean
  }
`

export const ChatPubSubModule = createModule({
  id: `chat-pubsub-module`,
  dirname: __dirname,
  typeDefs: ChatPubSubSchema,
  resolvers: ChatPubSubResolvers,
})
