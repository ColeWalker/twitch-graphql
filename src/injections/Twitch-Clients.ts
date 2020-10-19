import 'reflect-metadata'
import { ApiClient, AuthProvider } from 'twitch'
import { PubSub } from 'graphql-subscriptions'
import RefreshToken from '../helpers/RefreshToken'
import { Injectable } from 'graphql-modules'
import { PubSubClient } from 'twitch-pubsub-client/lib'
require('dotenv').config()

declare global {
  namespace GraphQLModules {
    interface GlobalContext {
      twitch_id: string
      refresh_token: string
      secret: string
      user_id: string
      authProvider: AuthProvider
      twitchClient: ApiClient
      app: any
      callbackUrl: string
      webhookPort: string
      pubsub: PubSub
      connectionParams: {
        twitch_id: string
        refresh_token: string
        secret: string
        user_id: string
      }
    }
  }
}

@Injectable()
export class TwitchClients {
  async apiClient() {
    const authProvider = await RefreshToken()
    return new ApiClient({ authProvider, preAuth: true })
  }

  async pubSubClient() {
    return new PubSubClient()
  }

  async authProvider() {
    return RefreshToken()
  }
}
