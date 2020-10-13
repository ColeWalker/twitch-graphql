import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { parse, execute } from 'graphql'
import { QueryModule } from './query-type-schema'
import { UserSubscriberLinkModule } from './user-subscriber-link-type-schema'
import nock from 'nock'
import {
  expectedUserObject,
  expectedUserRaw,
  helixSubRaw,
  krakenSubRaw,
  userFollowObject,
  userFollowsObject,
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

describe('UserModule', () => {
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
    expect(result?.errors?.length).toBeFalsy()

    const user = await result?.data?.latestSub?.user
    expect(user).toMatchObject(expectedUserObject)
  })
  it('getUserById should work', async () => {
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
        getUserById(userId: "IIIsutha067III"){
            displayName
            description
            id
            profilePictureURL
            views
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
    const user = await result?.data?.getUserById
    expect(user).toMatchObject(expectedUserObject)
  })

  it('getUserByDisplayName should work', async () => {
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
        getUserByDisplayName(displayName: "IIIsutha067III"){
            displayName
            description
            id
            profilePictureURL
            views
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

    const user = await result?.data?.getUserByDisplayName

    expect(user).toMatchObject(expectedUserObject)
  })
})

describe('follows', () => {
  it('followsId should work', async () => {
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
        latestSub{
          user {
            displayName
            followsId(userId: "anything")
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
    const follows = result?.data?.latestSub?.user?.followsId
    expect(follows).toBe(true)
  })

  it('followsDisplayName should work', async () => {
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
        latestSub{
          user {
            displayName
            followsDisplayName(displayName: "anything")
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
    const follows = result?.data?.latestSub?.user?.followsDisplayName
    expect(follows).toBe(true)
  })
  it('follows should work', async () => {
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
        getUserByDisplayName(displayName: "IIIsutha067III"){
          displayName
          follows(maxPages: 1) {
            total
            nodes{
              followDateUTC
              followDate
            }
            cursor
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
    const follows = result?.data?.getUserByDisplayName?.follows

    expect(follows).toMatchObject(userFollowsObject)
  })
  it('getFollowToId should work', async () => {
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
          user {
            displayName
            getFollowToId(userId: "321"){
              followDate
              followDateUTC
              
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

    const follow = result?.data?.latestSub?.user?.getFollowToId
    expect(follow).toMatchObject(userFollowObject)
  })

  it('getFollowToDisplayName should work', async () => {
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
          user {
            displayName
            getFollowToDisplayName(displayName: "LIRIK"){
              followDate
              followDateUTC
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
    const follow = result?.data?.latestSub?.user?.getFollowToDisplayName
    expect(follow).toMatchObject(userFollowObject)
  })
})
