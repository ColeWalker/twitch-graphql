import { createModule, gql } from 'graphql-modules'
import { TwitchClients } from '../injections/Twitch-Clients'
import { getLatestSub } from '../subscriptions/GetLatestSub'
import { UserId } from '../injections/User-Id'
import { TwitchId } from '../injections/Twitch-Id'
import { HelixSubscription } from 'twitch/lib'
import { getSubs } from '../subscriptions/GetSubs'
import { getCurrentSubCount } from '../subscriptions/SubCount'
require('dotenv').config()

const userId = process.env.USER_ID || ''
const twitchId = process.env.TWITCH_ID || ''
export const SubscriberResolvers = {
  Query: {
    async latestSub(
      _parent: {},
      args: {},
      { injector }: GraphQLModules.ModuleContext
    ) {
      const clients = await injector.get(TwitchClients)
      const apiClient = await clients.apiClient()

      return await getLatestSub(injector.get(TwitchId), apiClient)
    },
    async allSubs(
      _parent: {},
      args: {},
      { injector }: GraphQLModules.ModuleContext
    ) {
      const clients = await injector.get(TwitchClients)
      const apiClient = await clients.apiClient()

      return await getSubs(injector.get(TwitchId), apiClient)
    },
    async subCount(
      _parent: {},
      args: {},
      { injector }: GraphQLModules.ModuleContext
    ) {
      const clients = await injector.get(TwitchClients)
      const apiClient = await clients.apiClient()
      return await getCurrentSubCount(injector.get(TwitchId), apiClient)
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

export const SubscriberModule = createModule({
  id: `subscriber-module`,
  dirname: __dirname,
  providers: [
    TwitchClients,
    {
      provide: TwitchId,
      useValue: twitchId,
    },
    {
      provide: UserId,
      useValue: userId,
    },
  ],
  typeDefs: gql`
    type Query {
      latestSub: Subscriber!
      allSubs: [Subscriber]!
      subCount: Int
    }

    type Subscriber {
      cumulativeMonths: Int!
      tier: Int!
      userDisplayName: String!
      userId: String!
      isGift: Boolean!
    }
  `,
  resolvers: SubscriberResolvers,
})
