import { authenticationMock, validationMock } from '../tests/mocks'
import nock from 'nock'
import RefreshToken from './RefreshToken'
nock(`https://id.twitch.tv`)
  .post('/oauth2/token')
  .query(true)
  .reply(200, authenticationMock)
  .persist()

nock(`https://id.twitch.tv`)
  .get('/oauth2/validate')
  .query(true)
  .reply(200, validationMock)
  .persist()

describe('RefreshToken', () => {
  it('Gets auth correctly', async () => {
    const auth = await RefreshToken('who', 'cares', 'doesnt-matter')
    expect(auth).toHaveProperty('clientId')
  })
})
