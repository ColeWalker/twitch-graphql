import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { parse, execute } from 'graphql'
import { QueryModule } from './query-type-schema'
import { UserSubscriberLinkModule } from './user-subscriber-link-type-schema'
import {
  authenticationMock,
  contextValue,
  expectedUserRaw,
  helixSubRaw,
  krakenSubRaw,
  validationMock,
} from '../tests/mocks'
import nock from 'nock'
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

    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    const user = result?.data?.latestSub?.user
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

            getSubscriptionToId(userId: "${userId}"){
              userId
              tier
              userDisplayName
              isGift
            }
          }
        }
      }
    `)

    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    const user = result?.data?.latestSub?.user
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

            getSubscriptionToDisplayName(displayName: "${displayName}"){
              userId
              tier
              userDisplayName
              isGift
            }
          }
        }
      }
    `)

    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    const user = result?.data?.latestSub?.user
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

    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    const user = result?.data?.latestSub?.user
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

    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    const user = result?.data?.latestSub?.user
    if (user) {
      expect(user).toBeTruthy()

      const sub = user?.isSubscribedToDisplayName
      expect(typeof sub).toEqual('boolean')
    }
  })
})
