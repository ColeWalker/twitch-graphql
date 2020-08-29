import RefreshToken from './RefreshToken'

describe('RefreshToken', () => {
  it('Gets auth correctly', async () => {
    const auth = await RefreshToken()
    expect(auth).toHaveProperty('clientId')
  })
})
