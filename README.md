# Twitch GraphQL

This is an open source twitch API graphql wrapper. If you clone this repository you can run it as a full-functioning server. It is also installable as an npm package.

By default it will run at `http://localhost:5555/graphql`.

[Contribution Guidelines](/CONTRIBUTING.md)

- [Twitch GraphQL](#twitch-graphql)
  - [Environment Variables](#environment-variables)
  - [Authentication via headers](#authentication-via-headers)
    - [Example of client setup](#example-of-client-setup)
  - [Webhooks](#webhooks)
    - [Why?](#why)
    - [Setting up ngrok](#setting-up-ngrok)
  - [Installation and Usage of the NPM Package](#installation-and-usage-of-the-npm-package)
  - [Command line arguments](#command-line-arguments)
  - [Commands](#commands)
  - [Getting a Twitch Refresh Token](#getting-a-twitch-refresh-token)
  - [Schemas Provided](#schemas-provided)
    - [Query](#query)
    - [Subscriber](#subscriber)
    - [User](#user)
    - [UserSubscriberLink](#usersubscriberlink)
    - [Stream](#stream)
    - [StreamUserLink](#streamuserlink)
    - [Game](#game)
    - [GameStreamLink](#gamestreamlink)
  - [PubSubs](#pubsubs)
    - [RedemptionPubSub](#redemptionpubsub)
    - [RedemptionUserLink](#redemptionuserlink)
    - [ChatPubSub](#chatpubsub)
    - [ChatUserLink](#chatuserlink)
    - [BitPubSub](#bitpubsub)
    - [BitUserLink](#bituserlink)
  - [SubscriptionPubSub](#subscriptionpubsub)
    - [SubscriptionPubSubChatLink](#subscriptionpubsubchatlink)
    - [SubscriptionPubSubUserLink](#subscriptionpubsubuserlink)
    - [FollowPubSub](#followpubsub)
    - [FollowPubSubUserLink](#followpubsubuserlink)

## Environment Variables

This project assumes that you already have a Twitch API App set up, and an OAuth token with every scope that you will need. This information will be stored inside of several environment variables in a .env file. If you need a Twitch API Application (for user ID and client secret), information regarding setting one up is [documented in the Twitch API documentation.](https://dev.twitch.tv/docs/api/) If you require an OAuth or refresh token, there is [documentation available in the Twitch API documentation.](https://dev.twitch.tv/docs/authentication) Alternatively, there is a [guide below on how to retrieve a refresh token.](#getting-a-twitch-refresh-token)

| Variable      | Value                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| SECRET        | Your application's secret                                                                                |
| USER_ID       | Your application's User ID                                                                               |
| TWITCH_ID     | Your Twitch account's ID                                                                                 |
| REFRESH_TOKEN | The refresh token for your OAuth token                                                                   |
| PORT          | The port that you want to run the server on                                                              |
| GRAPHIQL      | Whether or not you want the server to enable graphiql                                                    |
| WEBHOOK_PORT  | The port that you want to run the webhook listener on                                                    |
| CALLBACK_URL  | The full URL (including http) for twitch to send webhooks to (the URL the webhook port is accessible at) |

## Authentication via headers

This library now supports authentication via request headers. Headers will take priority over environment variables.

| Variable      | Value                                  |
| ------------- | -------------------------------------- |
| secret        | Your application's secret              |
| user_id       | Your application's User ID             |
| twitch_id     | Your Twitch account's ID               |
| refresh_token | The refresh token for your OAuth token |

These items will be stored in the GraphQL modules global context in the same name as they appear in the headers. All of the headers are supported as connectionParams for Subscriptions.

For your convenience, the `context` and `onConnect` methods have been provided to automatically set the global context in the expected manner.

```ts
import { context, onConnect } from 'twitch-graphql'

const server = new ApolloServer({
  schema,
  subscriptions: {
    path: `/subscriptions`,
    onConnect,
  },
  context,
})
```

### Example of client setup

Here is an apollo client setup that will just work.

```ts
const httpLink = new HttpLink({
  uri: 'http://localhost:5555/graphql',
  headers: {
    twitch_id: 'YOUR_TWITCH_ID',
    refresh_token: 'YOUR_TOKEN',
    secret: 'YOUR_SECRET',
    user_id: 'YOUR_USER_ID',
  },
})

const wsLink = new WebSocketLink({
  uri: `ws://localhost:5555/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: {
      twitch_id: 'YOUR_TWITCH_ID',
      refresh_token: 'YOUR_TOKEN',
      secret: 'YOUR_SECRET',
      user_id: 'YOUR_USER_ID',
    },
  },
})

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  uri: 'http://localhost:5555/graphql',
  cache: new InMemoryCache(),
  link: splitLink,
})
```

## Webhooks

Twitch doesn't have a PubSub for follows yet, so if you need to use the follow subscription, you need to have this server port forwarded and open to outside requests.

### Why?

Webhooks work like this:

1. We tell Twitch we want to be notified whenever a follow happens.
2. Twitch sends us a request telling us they've confirmed that they will do that.
3. Twitch sends us requests with information about any follow event that occurs.

### Setting up ngrok

If you don't want to bother with port forwarding, you can use [ngrok](https://ngrok.com/) to set up a secure tunnel to your server from the outside using the following steps.

1. Download ngrok
2. Run `./ngrok http PORT` in the directory where ngrok was downloaded, where `PORT` is your `WEBHOOK_PORT` environment variable.
3. ngrok will log an `http` url and an `https` `something.ngrok.io` url in the console window, copy and paste this into the `CALLBACK_URL` environment variable.

You will need to repeat this process _each time_ that you restart ngrok.

## Installation and Usage of the NPM Package

This library is also available as a NPM package.

To install, run

`npm install twitch-graphql`

or

`yarn add twitch-graphql`

Usage of the package depends on the structure of your application. If you choose to use [graphql-modules](https://graphql-modules.com/) (Recommended), you can import the modules that you require and add them to your application, complete with authentication.

Every module in this library depends on the base module, "Query". You will **_ALWAYS NEED TO IMPORT AND USE `QueryModule`_**

Example:

```ts
import express from 'express'
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
import { FollowPubSubModule } from './schema/follow-pubsub-type.schema'
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
  introspection: true,
  subscriptions: {
    path: `/subscriptions`,
    onConnect,
  },
  context,
  playground: true,
})

const expressApp = express()

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
```

This example will run a server containing all of the current Twitch API modules.

Alternatively, you can import the schema and resolvers separately. However, since the resolvers require a grapqhl-modules dependency injection to retrieve authentication information, you may have to rewrite them entirely if you choose to not use grapqhl-modules for your architecture.

Examples of importing Schema and Resolvers:

```ts
import { QuerySchema, QueryResolver } from 'twitch-graphql'
import { StreamSchema, StreamResolvers } from 'twitch-graphql'
import { SubscriberSchema, SubscriberResolvers } from 'twitch-graphql'
import { UserSchema, UserResolvers } from 'twitch-graphql
```

## Command line arguments

```
-p, --port The port number that the server should use. Not available with yarn dev. [number]

-g, --graphiql Enables graphiql. [flag]
```

## Commands

| Command    | Action                                                        |
| ---------- | ------------------------------------------------------------- |
| yarn build | Runs typescript compiler, compiles to ./dist                  |
| yarn start | Runs ./dist statically, does not refresh                      |
| yarn dev   | Runs auto refreshing development server                       |
| yarn dev-g | Runs auto refreshing development server with graphiql enabled |

## Getting a Twitch Refresh Token

After you have set up your twitch application, you can get all of the required keys by doing the following:

1. Visit the following url: `https://id.twitch.tv/oauth2/authorize?client_id=YOUR APPLICATION CLIENT ID&redirect_uri=http://localhost&response_type=code&scope=channel:read:subscriptions+channel_subscriptions+analytics:read:games+chat:read whispers:read+channel:read:redemptions+bits:read`
2. It will send you to `localhost://code=SOME CODE/other-junk` copy the code only.
3. Paste the code into a POST request at this URL: `https://id.twitch.tv/oauth2/token?client_id=YOUR CLIENT ID&client_secret=YOUR CLIENT SECRET&code=YOUR CODE&grant_type=authorization_code&redirect_uri=http://localhost`

This will respond with the refresh token that you need.

## Schemas Provided

### Query

Base schema, all other modules extend this.

### Subscriber

```ts
import { SubscriberModule } from 'twitch-graphql'
```

```graphql
extend type Query {
  latestSub: Subscriber!
  randomSub: Subscriber!
  allSubs: [Subscriber]!
  subCount: Int!
  getSubscriberByDisplayName(displayName: String!): Subscriber
}

type Subscriber {
  cumulativeMonths: Int!
  tier: Int!
  userDisplayName: String!
  userId: String!
  isGift: Boolean!
}
```

### User

```ts
import { UserModule } from 'twitch-graphql'
```

Please note that using follows with a high number of maxPages will likely result in rate limiting from twitch.

```graphql
type User {
  displayName: String!
  description: String!
  id: String!
  profilePictureURL: String!
  views: Int!

  follows(maxPages: Int!): FollowConnection

  getFollowToId(userId: String!): Follow
  getFollowToDisplayName(displayName: String!): Follow

  followsId(userId: String!): Boolean!
  followsDisplayName(displayName: String!): Boolean!
}

type Follow {
  followDateUTC: String!
  followDate: String!
  followerUser: User!
  followedUser: User!
}

type FollowConnection {
  total: Int!
  nodes: [Follow]
  cursor: String
}

extend type Query {
  getUserById(userId: String!): User
  getUserByDisplayName(displayName: String!): User
}
```

### UserSubscriberLink

```ts
import { UserSubscriberLinkModule } from 'twitch-graphql'
```

This module extends Subscriber to add the user field. Only use if both modules are being used in your application.

```graphql
extend type Subscriber {
  user: User!
}

extend type User {
  isSubscribedToId(userId: String!): Boolean!
  isSubscribedToDisplayName(displayName: String!): Boolean!

  getSubscriptionToId(userId: String!): Subscriber
  getSubscriptionToDisplayName(displayName: String!): Subscriber
}
```

### Stream

```ts
import { Stream } from 'twitch-graphql'
```

```graphql
type Stream {
  language: String!
  gameId: String!
  id: String!
  title: String!
  viewers: Int!
  thumbnailUrl: String!
  userDisplayName: String!
  userId: String!
}

type StreamConnection {
  total: Int!
  nodes: [Stream]
  cursor: String
}

extend type Query {
  getStreams(streamFilter: StreamFilter!, maxPages: Int = 1): StreamConnection
}

input StreamFilter {
  gameIds: [String]
  gameNames: [String]
  languages: [String]
  type: StreamType
  userIds: [String]
  userNames: [String]
}

enum StreamType {
  live
  none
}
```

### StreamUserLink

```ts
import { StreamUserLinkModule } from 'twitch-graphql'
```

This module extends Stream to add the user field, and User to add the stream field. Only use if both modules are being used in your application.

```graphql
extend type User {
  stream: Stream
}

extend type Stream {
  user: User
}
```

### Game

```ts
import { GameModule } from 'twitch-graphql'
```

```graphql
type Game {
  boxArtUrl: String!
  id: String!
  name: String!
}

extend type Query {
  getGameByName(gameName: String!): Game
}
```

### GameStreamLink

```ts
import { GameStreamLinkModule } from 'twitch-graphql'
```

This module extends Stream to add the game field. Only use if both modules are being used in your application.

```graphql
extend type Stream {
  game: Game
}
```

## PubSubs

Twitch PubSubs are supported using [GraphQL Subscriptions.](https://www.apollographql.com/docs/apollo-server/data/subscriptions/)

Currently these PubSub modules are in an **experimental** phase, since no unit tests have been written for them, and have only been tested manually.

### RedemptionPubSub

```ts
import { RedemptionPubSubModule } from 'twitch-graphql'
```

```graphql
type Redemption {
  userId: String
  id: String
  channelId: String
  userName: String
  userDisplayName: String
  redemptionDate: String
  rewardId: String
  rewardName: String
  rewardPrompt: String
  rewardCost: Int
  rewardIsQueued: String
  rewardImage: String
  message: String
  status: String
}

extend type Subscription {
  newRedemption: Redemption
}
```

### RedemptionUserLink

```ts
import { RedemptionUserLinkModule } from 'twitch-graphql'
```

```graphql
extend type Redemption {
  user: User
  channelRedeemedAt: User
}
```

### ChatPubSub

```ts
import { ChatPubSubModule } from 'twitch-graphql'
```

```graphql
type Chat {
  message: String
  displayName: String
  channel: String
}

extend type Subscription {
  newChat(channel: String!): Chat
}
```

### ChatUserLink

```ts
import { ChatUserLinkModule } from 'twitch-graphql'
```

```graphql
extend type Chat {
  user: User
}
```

### BitPubSub

```ts
import { BitPubSubModule } from 'twitch-graphql'
```

```graphql
type Bits {
  userId: String
  userName: String
  message: String
  bits: Int
  totalBits: Int
  isAnonymous: Boolean
}

extend type Subscription {
  newBits: Bits
}
```

### BitUserLink

```ts
import { BitPubSubModule } from 'twitch-graphql'
```

```graphql
extend type Bit {
  user: User
}
```

## SubscriptionPubSub

```ts
import { SubscriptionPubSubModule } from 'twitch-graphql'
```

```graphql
type SubscriptionMessage {
  userId: String
  userName: String
  userDisplayName: String
  streakMonths: Int
  cumulativeMonths: Int
  months: Int
  time: String
  subPlan: String
  isResub: Boolean
  isGift: Boolean
  isAnonymous: Boolean
  gifterId: String
  gifterName: String
  gifterDisplayName: String
  giftDuration: Int
}

extend type Subscription {
  newSubscription: SubscriptionMessage
}
```

### SubscriptionPubSubChatLink

```ts
import { SubscriptionPubSubChatLinkModule } from 'twitch-graphql'
```

```graphql
extend type SubscriptionMessage {
  message: Chat
}
```

### SubscriptionPubSubUserLink

```ts
import { SubscriptionPubSubUserLinkModule } from 'twitch-graphql'
```

```graphql
extend type SubscriptionMessage {
  user: User
  gifterUser: User
}
```

### FollowPubSub

```ts
import { FollowPubSubModule } from 'twitch-graphql'
```

```graphql
type FollowSubscription {
  followDate: String
  followedUserDisplayName: String
  followedUserId: String
  userDisplayName: String
  userId: String
}

extend type Subscription {
  newFollow: FollowSubscription
}
```

### FollowPubSubUserLink

```ts
import { FollowPubSubUserLinkModule } from 'twitch-graphql'
```

```graphql
extend type FollowSubscription {
  followedUser: User
  followerUser: User
}
```
