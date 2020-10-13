import { createModule, gql } from 'graphql-modules'
import { getLatestSub } from '../subscriptions/GetLatestSub'
import { ApiClient, HelixSubscription } from 'twitch/lib'
import { getSubs } from '../subscriptions/GetSubs'
import { getCurrentSubCount } from '../subscriptions/SubCount'
import { getRandomSub } from '../subscriptions/GetRandomSub'
import RefreshToken from '../helpers/RefreshToken'

export const SubscriberResolvers = {
  Query: {
    async latestSub(
      _parent: {},
      args: {},
      { user_id, secret, refresh_token }: GraphQLModules.ModuleContext
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })
      const myId = (await twitchClient.getTokenInfo()).userId
      return await getLatestSub(myId, twitchClient)
    },
    async randomSub(
      _parent: {},
      args: {},
      { user_id, secret, refresh_token }: Partial<GraphQLModules.ModuleContext>
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })
      const myId = (await twitchClient.getTokenInfo()).userId

      return await getRandomSub(myId, twitchClient)
    },
    async allSubs(
      _parent: {},
      args: {},
      { user_id, secret, refresh_token }: Partial<GraphQLModules.ModuleContext>
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })
      const myId = (await twitchClient.getTokenInfo()).userId

      return await getSubs(myId, twitchClient)
    },
    async subCount(
      _parent: {},
      args: {},
      { user_id, secret, refresh_token }: Partial<GraphQLModules.ModuleContext>
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })
      const myId = (await twitchClient.getTokenInfo()).userId

      return await getCurrentSubCount(myId, twitchClient)
    },
    async getSubscriberByDisplayName(
      _parent: {},
      args: { displayName: string },
      { user_id, secret, refresh_token }: Partial<GraphQLModules.ModuleContext>
    ) {
      const authProvider = await RefreshToken(user_id, secret, refresh_token)
      const twitchClient = new ApiClient({ authProvider, preAuth: true })
      const myId = (await twitchClient.getTokenInfo()).userId

      const allSubs = await getSubs(myId, twitchClient)

      return allSubs.find((sub) => sub.userDisplayName === args?.displayName)
    },
  },
  Subscriber: {
    async userId(obj: HelixSubscription) {
      return obj.userId
    },
    async userDisplayName(obj: HelixSubscription) {
      return obj.userDisplayName
    },
    async isGift(obj: HelixSubscription) {
      return obj.isGift
    },
    async tier(obj: HelixSubscription) {
      return obj.tier
    },
  },
}

export const SubscriberSchema = gql`
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
`

export const SubscriberModule = createModule({
  id: `subscriber-module`,
  dirname: __dirname,
  typeDefs: SubscriberSchema,
  resolvers: SubscriberResolvers,
})
