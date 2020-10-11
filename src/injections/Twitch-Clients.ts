import 'reflect-metadata'
import { ApiClient } from 'twitch'
import PubSubClient from 'twitch-pubsub-client'
import RefreshToken from '../helpers/RefreshToken'
import { Injectable } from 'graphql-modules'
require('dotenv').config()
@Injectable()
export class TwitchClients {
  async apiClient() {
    const authProvider = await RefreshToken()

    return new ApiClient({ authProvider, preAuth: true })
  }

  async pubSubClient() {
    return new PubSubClient()
  }
}
