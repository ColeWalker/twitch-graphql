import express from 'express'
import cors from 'cors'
import http from 'http'
import { QueryModule } from './schema/query-type-schema'
import { SubscriberModule } from './schema/subscriber-type-schema'
import { UserModule } from './schema/user-type-schema'
import { StreamModule } from './schema/stream-type-schema'
import { GameModule } from './schema/game-type-schema'
import { createApplication } from 'graphql-modules'
import { UserSubscriberLinkModule } from './schema/user-subscriber-link-type-schema'
import { GameStreamLinkModule } from './schema/game-stream-link-type-schema'
import { RedemptionPubSubModule } from './schema/redemption-pubsub-type-schema'
import { StreamUserLinkModule } from './schema/stream-user-link-type-schema'
import { RedemptionUserLinkModule } from './schema/redemption-pubsub-user-link-type-schema'
import { ChatPubSubModule } from './schema/chat-pubsub-type-schema'
import { ApolloServer } from 'apollo-server-express'
import { ChatUserLinkModule } from './schema/chat-pubsub-user-link-schema'
import { BitPubSubModule } from './schema/bit-pubsub-type-schema'
import { BitUserLinkModule } from './schema/bit-pubsub-user-link-schema'
import { SubscriptionPubSubModule } from './schema/subscription-pubsub-type-schema'
import { SubscriptionPubSubUserLinkModule } from './schema/subscription-pubsub-user-link-schema'
import { SubscriptionPubSubChatLinkModule } from './schema/subscription-pubsub-chat-link-schema'
import { onConnect, context } from './helpers/ServerSetup'
import { FollowPubSubModule } from './schema/follow-pubsub-type-schema'
require('dotenv').config()

let port = 5555

const portEnv = parseInt(process?.env?.PORT || '')
if (portEnv) {
  port = portEnv
}

const portIndex =
  process?.argv?.findIndex((arg) => arg === '--port' || arg === '-p') + 1

const portCmdNum = parseInt(process?.argv?.[portIndex])

if (portCmdNum) {
  port = portCmdNum
}

let useGraphiql = false
if (process?.env?.GRAPHIQL?.toLowerCase() === 'true') {
  useGraphiql = true
}

if (
  process?.argv?.some(
    (arg) => arg.toLowerCase() === '--graphiql' || arg.toLowerCase() === '-g'
  )
) {
  useGraphiql = true
}

const app = createApplication({
  modules: [
    QueryModule,
    SubscriberModule,
    UserModule,
    StreamModule,
    UserSubscriberLinkModule,
    GameStreamLinkModule,
    GameModule,
    StreamUserLinkModule,
    RedemptionPubSubModule,
    RedemptionUserLinkModule,
    ChatPubSubModule,
    ChatUserLinkModule,
    BitPubSubModule,
    BitUserLinkModule,
    SubscriptionPubSubModule,
    SubscriptionPubSubUserLinkModule,
    SubscriptionPubSubChatLinkModule,
    FollowPubSubModule,
  ],
})
app.createSubscription()

const schema = app.createSchemaForApollo()
const server = new ApolloServer({
  schema,
  introspection: useGraphiql,
  subscriptions: {
    path: `/subscriptions`,
    onConnect,
  },
  context,
  playground: useGraphiql,
})

const expressApp = express()
expressApp.use(cors())

server.applyMiddleware({ app: expressApp })
const httpServer = http.createServer(expressApp)
server.installSubscriptionHandlers(httpServer)

httpServer.listen(port, () => {
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
  )
})
