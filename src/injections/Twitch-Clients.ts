import 'reflect-metadata'
import { ApiClient } from 'twitch'
import { PubSubClient } from 'twitch-pubsub-client'
import RefreshToken from '../helpers/RefreshToken'
import { Injectable } from 'graphql-modules'
require('dotenv').config()

@Injectable()
class TwitchClients {
  static instance: TwitchClients
  constructor() {
    if (!TwitchClients.instance) {
      TwitchClients.instance = this
    }
    // Initialize object
    return TwitchClients.instance
  }
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

  async authProvider() {
    return RefreshToken()
  }
}
const instance = new TwitchClients()
Object.freeze(instance)
export default instance
