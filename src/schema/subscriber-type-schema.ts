import { createModule, gql } from 'graphql-modules'
import { TwitchClients } from '../injections/Twitch-Clients'
import { getLatestSub } from '../subscriptions/GetLatestSub'
import { UserId } from '../injections/User-Id'
import { TwitchId } from '../injections/Twitch-Id'
import { HelixSubscription } from 'twitch/lib'
import { getSubs } from '../subscriptions/GetSubs'
import { getCurrentSubCount } from '../subscriptions/SubCount'

export const SubscriberResolvers = {
  Query: {
    async latestSub(
      _parent: {},
      args: {},
      { injector }: GraphQLModules.ModuleContext
    ) {
      const clients = await injector.get(TwitchClients)
      const apiClient = await clients.apiClient()
      const twitchId = injector.get(TwitchId).id()
      return await getLatestSub(twitchId, apiClient)
    },
    async allSubs(
      _parent: {},
      args: {},
      { injector }: GraphQLModules.ModuleContext
    ) {
      const clients = await injector.get(TwitchClients)
      const apiClient = await clients.apiClient()
      const twitchId = injector.get(TwitchId).id()

      return await getSubs(twitchId, apiClient)
    },
    async subCount(
      _parent: {},
      args: {},
      { injector }: GraphQLModules.ModuleContext
    ) {
      const clients = await injector.get(TwitchClients)
      const apiClient = await clients.apiClient()
      const twitchId = injector.get(TwitchId).id()

      return await getCurrentSubCount(twitchId, apiClient)
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
  providers: [TwitchClients, TwitchId, UserId],
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
