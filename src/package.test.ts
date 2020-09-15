import { execute, parse } from 'graphql'
import { createApplication } from 'graphql-modules'
import {
  GameModule,
  GameResolvers,
  GameSchema,
  SubscriberModule,
  SubscriberResolvers,
  SubscriberSchema,
  StreamModule,
  StreamResolvers,
  StreamSchema,
  UserModule,
  UserResolvers,
  UserSchema,
  QueryModule,
  QueryResolvers,
  QuerySchema,
  UserSubscriberLinkModule,
  UserSubscriberLinkResolvers,
  UserSubscriberLinkSchema,
  GameStreamLinkModule,
  GameStreamLinkResolvers,
  GameStreamLinkSchema,
} from './index'

describe('npm package', () => {
  it('everything should exist', () => {
    expect(GameModule).toBeTruthy()
    expect(GameResolvers).toBeTruthy()
    expect(GameSchema).toBeTruthy()
    expect(SubscriberModule).toBeTruthy()
    expect(SubscriberResolvers).toBeTruthy()
    expect(SubscriberSchema).toBeTruthy()
    expect(StreamModule).toBeTruthy()
    expect(StreamResolvers).toBeTruthy()
    expect(StreamSchema).toBeTruthy()
    expect(UserModule).toBeTruthy()
    expect(UserResolvers).toBeTruthy()
    expect(UserSchema).toBeTruthy()
    expect(QueryModule).toBeTruthy()
    expect(QueryResolvers).toBeTruthy()
    expect(QuerySchema).toBeTruthy()
    expect(UserSubscriberLinkModule).toBeTruthy()
    expect(UserSubscriberLinkResolvers).toBeTruthy()
    expect(UserSubscriberLinkSchema).toBeTruthy()
    expect(GameStreamLinkModule).toBeTruthy()
    expect(GameStreamLinkResolvers).toBeTruthy()
    expect(GameStreamLinkSchema).toBeTruthy()
  })

  it('modules should work together', async () => {
    const app = createApplication({
      modules: [
        QueryModule,
        SubscriberModule,
        UserModule,
        StreamModule,
        UserSubscriberLinkModule,
        GameStreamLinkModule,
        GameModule,
      ],
    })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        latestSub {
          user{
            stream {
              game {
                id
                boxArtUrl
                name
              }
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
  })
})
