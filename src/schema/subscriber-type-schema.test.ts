import { SubscriberModule } from './subscriber-type-schema'
import { execute, parse } from 'graphql'
import { createApplication } from 'graphql-modules'

describe('SubscriberModule', () => {
  it('latestSub', async () => {
    const app = createApplication({ modules: [SubscriberModule] })
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

  it('allSubs', async () => {
    const app = createApplication({ modules: [SubscriberModule] })
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

  it('subCount', async () => {
    const app = createApplication({ modules: [SubscriberModule] })
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
})
