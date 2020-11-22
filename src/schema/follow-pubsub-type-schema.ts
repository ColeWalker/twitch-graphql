import { createModule, gql } from 'graphql-modules'
import { ApiClient } from 'twitch'
import asyncify from 'callback-to-async-iterator'
import RefreshToken from '../helpers/RefreshToken'
import { HelixFollow } from 'twitch'
import axios from 'axios'
export const FollowPubSubResolvers = {
  Subscription: {
    newFollow: {
      subscribe: async (
        _: any,
        _args: any,
        {
          user_id,
          secret,
          refresh_token,
          callbackUrl,
          pubsub,
        }: GraphQLModules.Context
      ) => {
        const authProvider = await RefreshToken(user_id, secret, refresh_token)
        const authToken = await authProvider.getAccessToken()
        const twitchClient = new ApiClient({ authProvider, preAuth: true })
        const myId = (await twitchClient.getTokenInfo()).userId
        const followersTopic = `https://api.twitch.tv/helix/users/follows?to_id=${myId}&first=1`
        if (authToken?.accessToken) {
          try {
            await axios.post(
              'https://api.twitch.tv/helix/webhooks/hub',
              {
                'hub.callback': callbackUrl + '/webhooks' + '/follows',
                'hub.mode': 'subscribe',
                'hub.topic': followersTopic,
                'hub.lease_seconds': 60,
              },
              {
                headers: {
                  Authorization: `Bearer ${authToken?.accessToken}`,
                  'Client-ID': user_id,
                  'Content-Type': 'application/json',
                },
              }
            )
          } catch (error) {
            throw error
          }
        }

        // I am aware that pubsub.asyncIterator('FOLLOWS') exists
        // but it hasn't been working nicely so I'm doing this
        const curried = async (cb: any) =>
          await pubsub.subscribe(`FOLLOWS-${myId}`, (follow) => {
            const helix = new HelixFollow(follow, twitchClient)
            return cb(helix)
          })
        return asyncify(curried)
      },
      resolve: async (follow: HelixFollow) => {
        return follow
      },
    },
  },
}

export const FollowPubSubSchema = gql`
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
`

export const FollowPubSubModule = createModule({
  id: `follow-pubsub-module`,
  dirname: __dirname,
  typeDefs: FollowPubSubSchema,
  resolvers: FollowPubSubResolvers,
})
