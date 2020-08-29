import express from 'express'
import ApiClient from 'twitch'
import PubSubClient from 'twitch-pubsub-client'
import getCurrentSubCount from './subscriptions/SubCount'
import RedemptionListener from './channel-points/RedemptionListener'
import SubscriptionListener from './subscriptions/SubscriptionListener'
import RefreshToken from './helpers/RefreshToken'
import cors from 'cors'
require('dotenv').config()

const app = express()
app.use(cors())
;(async () => {
  //   const userName = process.env.TWITCH_USER_NAME || ''
  const channelID = process.env.TWITCH_ID || ''
  console.log(channelID)
  const authProvider = await RefreshToken()
  const apiClient = new ApiClient({ authProvider })
  const pubSubClient = new PubSubClient()
  await pubSubClient.registerUserListener(apiClient)

  app.set('subCount', await getCurrentSubCount(channelID, apiClient))
  await RedemptionListener(channelID, pubSubClient)

  await SubscriptionListener(channelID, pubSubClient, apiClient, app)
  app.listen(5555)
})()
