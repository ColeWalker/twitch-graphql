# Twitch GraphQL

This is an open source twitch API graphql wrapper. If you clone this repository you can run it as a full-functioning server. It is also installable as an npm package.

By default it will run at `http://localhost:5555/graphql`.

- [Twitch GraphQL](#twitch-graphql)
  - [Environment Variables](#environment-variables)
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

## Environment Variables

This project assumes that you already have a Twitch API App set up, and an OAuth token with every scope that you will need. This information will be stored inside of several environment variables in a .env file. If you need a Twitch API Application (for user ID and client secret), information regarding setting one up is [documented in the Twitch API documentation.](https://dev.twitch.tv/docs/api/) If you require an OAuth or refresh token, there is [documentation available in the Twitch API documentation.](https://dev.twitch.tv/docs/authentication) Alternatively, there is a [guide below on how to retrieve a refresh token.](#getting-a-twitch-refresh-token)

| Variable      | Value                                                 |
| ------------- | ----------------------------------------------------- |
| SECRET        | Your application's secret                             |
| USER_ID       | Your application's User ID                            |
| TWITCH_ID     | Your Twitch account's ID                              |
| REFRESH_TOKEN | The refresh token for your OAuth token                |
| PORT          | The port that you want to run the server on           |
| GRAPHIQL      | Whether or not you want the server to enable graphiql |

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
import { graphqlHTTP } from 'express-graphql'
import { QueryModule } from 'twitch-graphql'
import { SubscriberModule } from 'twitch-graphql'
import { UserModule } from 'twitch-graphql'
import { StreamModule } from 'twitch-graphql'
import { GameModule } from 'twitch-graphql'
import { UserSubscriberLinkModule } from 'twitch-graphql'
import { StreamUserLinkModule } from 'twitch-graphql'
import { GameStreamLinkModule } from 'twitch-graphql'
import { createApplication } from 'graphql-modules'

const port = 5555
const app = createApplication({
  modules: [
    QueryModule,
    SubscriberModule,
    UserModule,
    StreamModule,
    GameModule,
    UserSubscriberLinkModule,
    StreamUserLinkModule,
    GameStreamLinkModule,
  ],
})
const execute = app.createExecution()
const server = express()

server.use(
  '/graphql',
  graphqlHTTP((request: any) => ({
    schema: app.schema,
    graphiql: useGraphiql,
    customExecuteFn: execute as any,
    context: { request },
  }))
)

server.listen(port, () => {
  console.log(`server listening at ${port}, graphiql enabled: ${useGraphiql}`)
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

This module extends Subscriber to add the user field. Only use if both modules are being used in your application.

```graphql
extend type Subscriber {
  user: User!
}
```

### Stream

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
```

### StreamUserLink

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

This module extends Stream to add the game field. Only use if both modules are being used in your application.

```graphql
extend type Stream {
  game: Game
}
```
