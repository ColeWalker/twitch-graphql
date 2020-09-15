import { gql, createModule } from 'graphql-modules'
import { HelixSubscription } from 'twitch/lib'
import { TwitchClients } from '../injections/Twitch-Clients'
import { TwitchId } from '../injections/Twitch-Id'
import { UserId } from '../injections/User-Id'

export const UserSubscriberLinkResolvers = {
  Subscriber: {
    async user(sub: HelixSubscription) {
      return await sub.getUser()
    },
  },
}
export const UserSubscriberLinkSchema = gql`
  extend type Subscriber {
    user: User!
  }
`
export const UserSubscriberLinkModule = createModule({
  id: `user-subscriber-link-module`,
  dirname: __dirname,
  typeDefs: UserSubscriberLinkSchema,
  providers: [TwitchClients, TwitchId, UserId],
  resolvers: UserSubscriberLinkResolvers,
})
