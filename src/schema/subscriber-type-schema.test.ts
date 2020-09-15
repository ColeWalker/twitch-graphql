import { SubscriberModule } from './subscriber-type-schema'
import { execute, parse } from 'graphql'
import { createApplication } from 'graphql-modules'
import { UserModule } from './user-type-schema'
import { QueryModule } from './query-type-schema'
import { UserSubscriberLinkModule } from './user-subscriber-link-type-schema'

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
    const contextValue = { request: {}, response: {} }
    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    expect(result?.data?.randomSub).toHaveProperty('tier')
    expect(result?.data?.randomSub).toHaveProperty('userId')
    expect(result?.data?.randomSub).toHaveProperty('isGift')
    expect(result?.data?.randomSub).toHaveProperty('userDisplayName')
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
    const contextValue = { request: {}, response: {} }
    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    expect(Array.isArray(result?.data?.allSubs)).toBeTruthy()
  })

  it('findSub', async () => {
    const app = createApplication({ modules: [QueryModule, SubscriberModule] })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        getSubscriberByDisplayName(displayName: "SupCole") {
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
    expect(result?.data?.getSubscriberByDisplayName).toBeTruthy()
    expect(result?.data?.getSubscriberByDisplayName).toHaveProperty('tier')
    expect(result?.data?.getSubscriberByDisplayName).toHaveProperty('userId')
    expect(result?.data?.getSubscriberByDisplayName).toHaveProperty('isGift')
    expect(result?.data?.getSubscriberByDisplayName).toHaveProperty(
      'userDisplayName'
    )
  })

  it('subCount', async () => {
    const app = createApplication({ modules: [QueryModule, SubscriberModule] })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        subCount
      }
    `)
    const contextValue = { request: {}, response: {} }
    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    expect(result?.data?.subCount).toBeTruthy()
  })

  it('sub user', async () => {
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
    expect(result?.data?.latestSub?.user).toBeTruthy()
  })
})