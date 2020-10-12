import { SubscriberModule } from './subscriber-type-schema'
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
    const app = createApplication({ modules: [QueryModule, SubscriberModule] })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        randomSub {
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
    expect(expectedAllSubs).toContainEqual(result?.data?.randomSub)
  })

  it('allSubs', async () => {
    const app = createApplication({ modules: [QueryModule, SubscriberModule] })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        allSubs {
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
    expect(result?.data?.allSubs).toMatchObject(expectedAllSubs)
  })

  it('findSub', async () => {
    const app = createApplication({ modules: [QueryModule, SubscriberModule] })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        getSubscriberByDisplayName(displayName: "snoirf") {
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
    const sub = result?.data?.getSubscriberByDisplayName
    expect(sub).toMatchObject(expectedAllSubs[0])
  })

  it('subCount', async () => {
    const app = createApplication({ modules: [QueryModule, SubscriberModule] })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        subCount
      }
    `)

    const result = await execute({
      schema,
      contextValue,
      document,
    })
    console.log(result?.errors)
    expect(result?.errors?.length).toBeFalsy()
    expect(result?.data?.subCount).toEqual(1)
  })
})
