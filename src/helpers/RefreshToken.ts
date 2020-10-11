import axios from 'axios'
import { AuthProvider, StaticAuthProvider } from 'twitch/lib'
import { error } from 'console'
require('dotenv').config()

const client_ids = process.env.USER_ID || ''
const client_secrets = process.env.SECRET || ''
const refresh_tokens = process.env.REFRESH_TOKEN || ''

export default async (
  clientId: string | undefined,
  clientSecret: string | undefined,
  refreshToken: string | undefined
): Promise<AuthProvider> => {
  if (!clientId?.length || !clientSecret?.length || !refreshToken?.length) {
    clientId = await client_ids
    clientSecret = await client_secrets
    refreshToken = await refresh_tokens
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
