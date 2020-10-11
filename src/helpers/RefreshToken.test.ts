import RefreshToken from './RefreshToken'
import nock from 'nock'
import axios from 'axios'

require('dotenv').config()
const clientIds = async () => 'user_id'
const clientSecrets = async () => 'client_secret'
const refreshTokens = async () => 'refresh_token'

axios.defaults.adapter = require('axios/lib/adapters/http')
describe('RefreshToken', () => {
  it('Gets auth correctly', async () => {
    const clientId = await clientIds()
    const clientSecret = await clientSecrets()
    const refreshToken = await refreshTokens()
    nock('https://id.twitch.tv/oauth2')
      .post(
        `/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`
      )
      .reply(200, {
        access_token: 'dummy_string',
      })
      .persist()
    const auth = await RefreshToken(
      clientIds(),
      clientSecrets(),
      refreshTokens()
    )
    expect(auth).toHaveProperty('clientId')
    expect(auth.clientId).toBe('user_id')
  })
})
