import { ApiClient } from 'twitch/lib'
import RefreshToken from './RefreshToken'

export const onConnect = (connectionParams: any) => {
  return { ...connectionParams }
}

export const context = async ({ req, ...props }) => {
  if (props?.connection?.context) {
    const authProvider = await RefreshToken(
      props.connection.context.user_id,
      props.connection.context.client_secret,
      props.connection.context.refresh_token
    )
    const twitchClient = new ApiClient({ authProvider })
    return {
      ...props.connection.context,
      authProvider,
      twitchClient,
    }
  }
  const authProvider = await RefreshToken(
    req?.headers?.twitch_id,
    req?.headers?.secret,
    req?.headers?.refresh_token
  )
  const twitchClient = new ApiClient({ authProvider })
  return {
    twitch_id: req?.headers?.twitch_id,
    refresh_token: req?.headers?.refresh_token,
    secret: req?.headers?.secret,
    user_id: req?.headers?.user_id,
    authProvider,
    twitchClient,
  }
}
