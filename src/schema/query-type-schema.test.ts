import { SubscriberModule } from './subscriber-type-schema'
import { execute, parse } from 'graphql'
import { createApplication } from 'graphql-modules'
import { QueryModule } from './query-type-schema'
import nock from 'nock'
import {
  expectedUserRaw,
  helixSubRaw,
  krakenSubRaw,
  userFollowsRaw,
} from '../tests/mocks'

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

nock('https://api.twitch.tv')
  .get('/helix/users/follows')
  .query(true)
  .reply(200, userFollowsRaw)
  .persist()

describe('QueryModule', () => {
  it('query module can be extended to include latestSub', async () => {
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
    const contextValue = { request: {}, response: {} }
    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    expect(result?.data?.latestSub).toHaveProperty('tier')
    expect(result?.data?.latestSub).toHaveProperty('userId')
    expect(result?.data?.latestSub).toHaveProperty('isGift')
    expect(result?.data?.latestSub).toHaveProperty('userDisplayName')
  })
})
