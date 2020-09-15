import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { parse, execute } from 'graphql'
import { QueryModule } from './query-type-schema'
import { UserSubscriberLinkModule } from './user-subscriber-link-type-schema'
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

    expect(result?.errors?.length).toBeFalsy()
    const user = result?.data?.latestSub?.user
    expect(user).toBeTruthy()
    expect(user).toHaveProperty('displayName')
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('profilePictureURL')
    expect(user).toHaveProperty('views')
    expect(user).toHaveProperty('description')
  })
})
