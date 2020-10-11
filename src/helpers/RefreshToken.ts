import axios from 'axios'
import { AuthProvider, StaticAuthProvider } from 'twitch/lib'
import { error } from 'console'
require('dotenv').config()

const client_ids = async () => process.env.USER_ID || ''
const client_secrets = async () => process.env.SECRET || ''
const refresh_tokens = async () => process.env.REFRESH_TOKEN || ''

export default async (
  client_id: string | Promise<string>,
  client_secret: string | Promise<string>,
  refresh_token: string | Promise<string>
): Promise<AuthProvider> => {
  let clientId = client_id || (await client_ids())
  let clientSecret = client_secret || (await client_secrets())
  let refreshToken = refresh_token || (await refresh_tokens())
  if (!clientId?.length || !clientSecret?.length || !refreshToken?.length) {
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
