import { createModule, gql } from 'graphql-modules'

export const SubscriptionPubSubChatLinkSchema = gql`
  extend type SubscriptionMessage {
    message: Chat
  }
`

export const SubscriptionPubSubChatLinkModule = createModule({
  id: `subscription-pubsub-chat-link-module`,
  dirname: __dirname,
  typeDefs: SubscriptionPubSubChatLinkSchema,
})
