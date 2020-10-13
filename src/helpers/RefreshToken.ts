import axios from 'axios'
import { AuthProvider, StaticAuthProvider } from 'twitch/lib'
require('dotenv').config()

export default async (
  clientId?: string,
  clientSecret?: string,
  refreshToken?: string
): Promise<AuthProvider> => {
  if (!clientId?.length || !clientSecret?.length || !refreshToken?.length) {
    clientId = process.env.USER_ID || ''
    clientSecret = process.env.SECRET || ''
    refreshToken = process.env.REFRESH_TOKEN || ''
  }
  const raw = await axios.post(
    `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`
  )

  const accessToken = raw.data.access_token
  const authProvider: StaticAuthProvider = new StaticAuthProvider(
    clientId,
    accessToken
  )

  return authProvider
}
