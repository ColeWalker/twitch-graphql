import 'reflect-metadata'
import { ApiClient } from 'twitch'
import PubSubClient from 'twitch-pubsub-client'
import RefreshToken from '../helpers/RefreshToken'
import { Injectable } from 'graphql-modules'
require('dotenv').config()

@Injectable()
export class TwitchClients {
  async apiClient() {
    const client_id = process.env.USER_ID || ''
    const client_secret = process.env.SECRET || ''
    const refresh_token = process.env.REFRESH_TOKEN || ''

    const authProvider = await RefreshToken(
      client_id,
      client_secret,
      refresh_token
    )
    return new ApiClient({ authProvider, preAuth: true })
  }

  async pubSubClient() {
    return new PubSubClient()
  }
}
