import { createModule, gql } from 'graphql-modules'
import { ApiClient } from 'twitch/lib'
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
          await pubsub.subscribe('FOLLOWS', (follow) => {
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

// const fetch = require('isomorphic-fetch')

// export default async (_, res) => {
//   try {
//     const response = await fetch(
//       `https://api.twitch.tv/helix/users?login=${process.env.CHANNEL}`,
//       {
//         headers: {
//           authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//           'Client-ID': process.env.CLIENT_ID,
//         },
//       }
//     )

//     const {
//       data: [user],
//     } = await response.json()

//     const followersTopic = `https://api.twitch.tv/helix/users/follows?to_id=${user.id}&first=1`
//     const subscribersTopic = `https://api.twitch.tv/helix/subscriptions/events?broadcaster_id=${user.id}7&first=1`

//     await fetch('https://api.twitch.tv/helix/webhooks/hub', {
//       method: 'POST',
//       body: JSON.stringify({
//         'hub.callback': `${process.env.CALLBACK_URL}/api/webhooks`,
//         'hub.mode': 'subscribe',
//         'hub.topic': followersTopic,
//         'hub.lease_seconds': 60 * 60 * 4,
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//         authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//         'Client-ID': process.env.CLIENT_ID,
//       },
//     })

//     await fetch('https://api.twitch.tv/helix/webhooks/hub', {
//       method: 'POST',
//       body: JSON.stringify({
//         'hub.callback': `${process.env.CALLBACK_URL}/api/webhooks`,
//         'hub.mode': 'subscribe',
//         'hub.topic': subscribersTopic,
//         'hub.lease_seconds': 60 * 60 * 4,
//       }),
//       headers: {
//         'Content-Type': 'application/json',
//         authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
//         'Client-ID': process.env.CLIENT_ID,
//       },
//     })
//   } catch (error) {
//     console.log(error)
//   }

//   res.send(200)
// }
