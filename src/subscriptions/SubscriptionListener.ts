import { PubSubClient } from 'twitch-pubsub-client'

import { getCurrentSubCount } from './SubCount'
import { ApiClient } from 'twitch'
import express from 'express'
export default async function (
  channelID: string,
  pubSubClient: PubSubClient,
  apiClient: ApiClient,
  app: express.Application
) {
  return await pubSubClient.onSubscription(channelID, async (message) => {
    app.set('subCount', await getCurrentSubCount(channelID, apiClient))
  })
}
