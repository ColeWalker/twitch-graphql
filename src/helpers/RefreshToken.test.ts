import RefreshToken from './RefreshToken'
import nock from 'nock'
import axios from 'axios'

require('dotenv').config()
const clientId = 'user_id'
const clientSecret = 'client_secret'
const refreshToken = 'refresh_token'

axios.defaults.adapter = require('axios/lib/adapters/http')
describe('RefreshToken', () => {
  it('Gets auth correctly', async () => {
    const scope = nock('https://id.twitch.tv/oauth2')
      .post(
        `/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`
      )
      .reply(200, {
        access_token: 'dummy_string',
        latestSub: { user: 'dummy_user' },
        displayName: 'dummy_display_name',
        id: 1,
        profilePictureURL: 'dummy_url',
        views: 'dummy_view',
        description: 'dummy_description',
      })
      .persist()
    const auth = await RefreshToken(clientId, clientSecret, refreshToken)
    expect(scope).toBeTruthy()
    expect(auth).toHaveProperty('clientId')
    expect(auth.clientId).toBe('user_id')
  })
})
