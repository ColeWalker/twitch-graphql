import axios from 'axios'
import { AuthProvider, StaticAuthProvider } from 'twitch/lib'
import { error } from 'console'
require('dotenv').config()

export default async (): Promise<AuthProvider> => {
  const clientId = process.env.USER_ID || ''
  const clientSecret = process.env.SECRET || ''
  const refreshToken = process.env.REFRESH_TOKEN || ''

  if (!clientId.length || !clientSecret.length || !refreshToken.length) {
    throw error('env not loading properly')
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
