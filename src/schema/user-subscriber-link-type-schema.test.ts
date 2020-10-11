import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { parse, execute } from 'graphql'
import { QueryModule } from './query-type-schema'
import { UserSubscriberLinkModule } from './user-subscriber-link-type-schema'
import nock from 'nock'
import {
  expectedUserRaw,
  krakenSubRaw,
  helixSubRaw,
  userFollowsRaw,
  helixStreamRaw,
  helixGameRaw,
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
  .get('/helix/streams')
  .query(true)
  .reply(200, helixStreamRaw)
  .persist()
nock('https://api.twitch.tv')
  .get('/helix/games')
  .query(true)
  .reply(200, helixGameRaw)
  .persist()
nock('https://api.twitch.tv')
  .get('/helix/users/follows')
  .query(true)
  .reply(200, userFollowsRaw)
  .persist()

describe('UserSubscriberLinkModule', () => {
  it('user should have all fields', async () => {
    const app = createApplication({
      modules: [
        QueryModule,
        SubscriberModule,
        UserSubscriberLinkModule,
        UserModule,
      ],
    })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        latestSub {
          user{
            displayName
            description
            id
            profilePictureURL
            views
          }
        }
      }
    `)
    const contextValue = { request: {}, response: {} }
    const result = await execute({
      schema,
      contextValue,
      document,
    })

    console.log(result) //?

    expect(result?.errors?.length).toBeFalsy()
    const user = await result?.data?.latestSub?.user
    expect(user).toBeTruthy()
    expect(user).toHaveProperty('displayName')
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('profilePictureURL')
    expect(user).toHaveProperty('views')
    expect(user).toHaveProperty('description')
  })
  it('getSubscriptionToId', async () => {
    const app = createApplication({
      modules: [
        QueryModule,
        SubscriberModule,
        UserSubscriberLinkModule,
        UserModule,
      ],
    })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        latestSub {
          user{
            displayName
            description
            id
            profilePictureURL
            views

            getSubscriptionToId(userId: "123"){
              userId
              tier
              userDisplayName
              isGift
            }
          }
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
    const user = await result?.data?.latestSub?.user
    if (user) {
      expect(user).toBeTruthy()

      const sub = user?.getSubscriptionToId

      if (sub) {
        expect(sub).toHaveProperty('tier')
        expect(sub).toHaveProperty('userId')
        expect(sub).toHaveProperty('isGift')
        expect(sub).toHaveProperty('userDisplayName')
      }
    }
  })
  it('getSubscriptionToDisplayName', async () => {
    const app = createApplication({
      modules: [
        QueryModule,
        SubscriberModule,
        UserSubscriberLinkModule,
        UserModule,
      ],
    })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        latestSub {
          user{
            displayName
            description
            id
            profilePictureURL
            views

            getSubscriptionToDisplayName(displayName: "dallas"){
              userId
              tier
              userDisplayName
              isGift
            }
          }
        }
      }
    `)
    const contextValue = { request: {}, response: {} }
    const result = await execute({
      schema,
      contextValue,
      document,
    })
    console.log(result) //?

    expect(result?.errors?.length).toBeFalsy()
    const user = await result?.data?.latestSub?.user
    if (user) {
      expect(user).toBeTruthy()

      const sub = user?.getSubscriptionToDisplayName

      if (sub) {
        expect(sub).toHaveProperty('tier')
        expect(sub).toHaveProperty('userId')
        expect(sub).toHaveProperty('isGift')
        expect(sub).toHaveProperty('userDisplayName')
      }
    }
  })
  it('isSubscribedToId', async () => {
    const app = createApplication({
      modules: [
        QueryModule,
        SubscriberModule,
        UserSubscriberLinkModule,
        UserModule,
      ],
    })
    const schema = app.createSchemaForApollo()

    const userId = '23573216'

    const document = parse(`
      {
        latestSub {
          user{
            displayName
            description
            id
            profilePictureURL
            views

            isSubscribedToId(userId: "${userId}")
          }
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
    const user = await result?.data?.latestSub?.user
    if (user) {
      expect(user).toBeTruthy()

      const sub = user?.isSubscribedToId
      expect(typeof sub).toEqual('boolean')
    }
  })
  it('isSubscribedToDisplayName', async () => {
    const app = createApplication({
      modules: [
        QueryModule,
        SubscriberModule,
        UserSubscriberLinkModule,
        UserModule,
      ],
    })
    const schema = app.createSchemaForApollo()

    const displayName = 'SupCole'

    const document = parse(`
      {
        latestSub {
          user{
            displayName
            description
            id
            profilePictureURL
            views

            isSubscribedToDisplayName(displayName: "${displayName}")
          }
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
    const user = await result?.data?.latestSub?.user
    if (user) {
      expect(user).toBeTruthy()

      const sub = user?.isSubscribedToDisplayName
      expect(typeof sub).toEqual('boolean')
    }
  })
})
