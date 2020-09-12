import { getLatestSub } from './GetLatestSub'
import RefreshToken from '../helpers/RefreshToken'
import { ApiClient } from 'twitch'
import { getSubs } from './GetSubs'
import { getCurrentSubCount } from './SubCount'
import { getRandomSub } from './GetRandomSub'
require('dotenv').config()

describe('subscriptions', () => {
  it('getLatestSub should return subscription', async () => {
    const authProvider = await RefreshToken()
    const apiClient = new ApiClient({ authProvider })

    const latestSub = await getLatestSub(process.env.TWITCH_ID || '', apiClient)
    expect(latestSub).toBeTruthy()
  })

  it('getRandomSub should return subscription', async () => {
    const authProvider = await RefreshToken()
    const apiClient = new ApiClient({ authProvider })

    const randomSub = await getRandomSub(process.env.TWITCH_ID || '', apiClient)
    expect(randomSub).toBeTruthy()
  })

  it('getSubs should return subscriptions', async () => {
    const authProvider = await RefreshToken()
    const apiClient = new ApiClient({ authProvider })

    const allSubs = await getSubs(process.env.TWITCH_ID || '', apiClient)

    expect(Array.isArray(allSubs)).toBeTruthy()
  })

  it('getCurrentSubCount should return subscriptions', async () => {
    const authProvider = await RefreshToken()
    const apiClient = new ApiClient({ authProvider })

    const subCount = await getCurrentSubCount(
      process.env.TWITCH_ID || '',
      apiClient
    )

    expect(subCount).toBeTruthy()
  })
})
