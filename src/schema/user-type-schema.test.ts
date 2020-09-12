import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { parse, execute } from 'graphql'
import { QueryModule } from './query-type-schema'

describe('UserModule', () => {
  it('user should have all fields', async () => {
    const app = createApplication({
      modules: [QueryModule, SubscriberModule, UserModule],
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
    expect(result?.data?.latestSub?.user).toBeTruthy()
    expect(result?.data?.latestSub?.user).toHaveProperty('displayName')
    expect(result?.data?.latestSub?.user).toHaveProperty('id')
    expect(result?.data?.latestSub?.user).toHaveProperty('profilePictureURL')
    expect(result?.data?.latestSub?.user).toHaveProperty('views')
    expect(result?.data?.latestSub?.user).toHaveProperty('description')
  })
  it('getUserById should work', async () => {
    const app = createApplication({
      modules: [QueryModule, SubscriberModule, UserModule],
    })
    const schema = app.createSchemaForApollo()

    const userId = '23573216'
    const displayName = 'SupCole'

    const document = parse(`
      {
        getUserById(userId: "${userId}"){
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
    const user = result?.data?.getUserByDisplayName
    if (user) {
      expect(user).toHaveProperty('description')
      expect(user).toHaveProperty('profilePictureURL')
      expect(user).toHaveProperty('views')

      expect(user).toHaveProperty('id')
      expect(user.id).toEqual(userId)

      expect(user).toHaveProperty('displayName')
      expect(user.displayName).toEqual(displayName)
    }
  })
  it('getUserByDisplayName should work', async () => {
    const app = createApplication({
      modules: [QueryModule, SubscriberModule, UserModule],
    })
    const schema = app.createSchemaForApollo()

    const displayName = 'SupCole'
    const userId = '23573216'

    const document = parse(`
      {
        getUserByDisplayName(displayName: "${displayName}"){
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
    const user = result?.data?.getUserByDisplayName
    if (user) {
      expect(user).toHaveProperty('description')
      expect(user).toHaveProperty('profilePictureURL')
      expect(user).toHaveProperty('views')

      expect(user).toHaveProperty('id')
      expect(user.id).toEqual(userId)

      expect(user).toHaveProperty('displayName')
      expect(user.displayName).toEqual(displayName)
    }
  })
})
