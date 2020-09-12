import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { StreamModule } from './stream-type-schema'
import { parse, execute } from 'graphql'
import { QueryModule } from './query-type-schema'
describe('StreamModule', () => {
  it('stream should have all fields', async () => {
    const app = createApplication({
      modules: [QueryModule, SubscriberModule, UserModule, StreamModule],
    })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        latestSub {
          user{
            stream {
              language
              gameId
              id
              title
              viewers
              thumbnailUrl
              userDisplayName
              userId
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
    const stream = result?.data?.latestSub?.user?.stream
    if (stream) {
      expect(stream).toHaveProperty('language')
      expect(stream).toHaveProperty('gameId')
      expect(stream).toHaveProperty('id')
      expect(stream).toHaveProperty('title')
      expect(stream).toHaveProperty('viewers')
      expect(stream).toHaveProperty('thumbnailUrl')
      expect(stream).toHaveProperty('userDisplayName')
      expect(stream).toHaveProperty('userId')
    }
  })
})
