import { createModule, gql } from 'graphql-modules'
import { HelixFollow } from 'twitch'

export const FollowPubSubUserLinkResolvers = {
  FollowSubscription: {
    async followedUser(follow: HelixFollow) {
      return follow.getFollowedUser()
    },
    async followerUser(follow: HelixFollow) {
      return follow.getUser()
    },
  },
}
export const FollowPubSubUserLinkSchema = gql`
  extend type FollowSubscription {
    followedUser: User
    followerUser: User
  }
`

export const FollowPubSubUserLinkModule = createModule({
  id: `follow-pubsub-user-link-module`,
  dirname: __dirname,
  typeDefs: FollowPubSubUserLinkSchema,
  resolvers: FollowPubSubUserLinkResolvers,
})
