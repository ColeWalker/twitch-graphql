import 'reflect-metadata'
import { ApiClient, AuthProvider } from 'twitch'
import { PubSub } from 'graphql-subscriptions'

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
