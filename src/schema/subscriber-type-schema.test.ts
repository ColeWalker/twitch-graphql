import { SubscriberModule, SubscriberResolvers } from './subscriber-type-schema'
import { execute, parse } from 'graphql'
import { createApplication } from 'graphql-modules'
import { QueryModule } from './query-type-schema'
import nock from 'nock'
import {
  expectedAllSubs,
  expectedUserRaw,
  helixSubRaw,
  krakenSubRaw,
  contextValue,
  authenticationMock,
  validationMock,
} from '../tests/mocks'
import { ApiClient, HelixSubscription } from 'twitch'
import RefreshToken from '../helpers/RefreshToken'

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

nock('https://api.twitch.tv')
  .get('/helix/users')
  .query(true)
  .reply(200, {
    data: [expectedUserRaw],
  })
  .persist()
nock('https://api.twitch.tv')
  .get(/\/kraken\/channels\/[0-9]*\/subscriptions/)
  .query(true)
  .reply(200, krakenSubRaw)
  .persist()
nock('https://api.twitch.tv')
  .get('/helix/subscriptions')
  .query(true)
  .reply(200, helixSubRaw)
  .persist()

describe('SubscriberModule', () => {
  it('latestSub', async () => {
    const app = createApplication({ modules: [QueryModule, SubscriberModule] })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        latestSub {
          userId
          tier
          userDisplayName
          isGift
        }
      }
    `)

    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    expect(result?.data?.latestSub).toMatchObject(expectedAllSubs[1])
  })

  it('randomSub', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }

    const rawSub = await SubscriberResolvers.Query.randomSub(
      {},
      {},
      contextWithClient
    )

    expect(rawSub).toBeTruthy()
    expect(rawSub).toBeInstanceOf(HelixSubscription)
  })

  it('allSubs', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }

    const allSubs = (
      await SubscriberResolvers.Query.allSubs({}, {}, contextWithClient)
    ).map((x: HelixSubscription) => ({
      isGift: x.isGift,
      tier: Number(x.tier),
      userId: x.userId,
      userDisplayName: x.userDisplayName,
    }))

    expect(allSubs).toMatchObject(expectedAllSubs)
  })

  it('findSub', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }

    const getSub = await SubscriberResolvers.Query.getSubscriberByDisplayName(
      {},
      { displayName: 'snoirf' },
      contextWithClient
    )
    expect(getSub).toBeTruthy()
    expect({
      isGift: getSub?.isGift,
      tier: Number(getSub?.tier),
      userId: getSub?.userId,
      userDisplayName: getSub?.userDisplayName,
    }).toMatchObject(expectedAllSubs[0])
  })

  it('subCount', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }

    const subCount = await SubscriberResolvers.Query.subCount(
      {},
      {},
      contextWithClient
    )
    expect(subCount).toEqual(1)
  })
})
