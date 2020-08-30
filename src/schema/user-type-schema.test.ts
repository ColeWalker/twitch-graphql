import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { parse, execute } from 'graphql'

describe('UserModule', () => {
  it('user should have all fields', async () => {
    const app = createApplication({
      modules: [SubscriberModule, UserModule],
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
})
