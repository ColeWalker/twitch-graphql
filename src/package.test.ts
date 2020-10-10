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
  StreamUserLinkModule,
  StreamUserLinkResolvers,
  StreamUserLinkSchema,
  RedemptionPubSubModule,
  RedemptionPubSubResolvers,
  RedemptionPubSubSchema,
  RedemptionUserLinkModule,
  RedemptionUserLinkResolvers,
  RedemptionUserLinkSchema,
  ChatPubSubModule,
  ChatPubSubResolvers,
  ChatPubSubSchema,
  ChatUserLinkModule,
  ChatUserLinkResolvers,
  ChatUserLinkSchema,
  BitPubSubModule,
  BitPubSubResolvers,
  BitPubSubSchema,
  BitUserLinkModule,
  BitUserLinkResolvers,
  BitUserLinkSchema,
} from './index'
import nock from 'nock'
import {
  expectedUserRaw,
  helixGameRaw,
  helixStreamRaw,
  helixSubRaw,
  krakenSubRaw,
} from './tests/mocks'

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
    expect(StreamUserLinkModule).toBeTruthy()
    expect(StreamUserLinkResolvers).toBeTruthy()
    expect(StreamUserLinkSchema).toBeTruthy()
    expect(RedemptionUserLinkModule).toBeTruthy()
    expect(RedemptionUserLinkResolvers).toBeTruthy()
    expect(RedemptionUserLinkSchema).toBeTruthy()
    expect(RedemptionPubSubModule).toBeTruthy()
    expect(RedemptionPubSubResolvers).toBeTruthy()
    expect(RedemptionPubSubSchema).toBeTruthy()
    expect(ChatPubSubModule).toBeTruthy()
    expect(ChatPubSubResolvers).toBeTruthy()
    expect(ChatPubSubSchema).toBeTruthy()
    expect(ChatUserLinkModule).toBeTruthy()
    expect(ChatUserLinkResolvers).toBeTruthy()
    expect(ChatUserLinkSchema).toBeTruthy()
    expect(BitPubSubModule).toBeTruthy()
    expect(BitPubSubResolvers).toBeTruthy()
    expect(BitPubSubSchema).toBeTruthy()
    expect(BitUserLinkModule).toBeTruthy()
    expect(BitUserLinkResolvers).toBeTruthy()
    expect(BitUserLinkSchema).toBeTruthy()
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
        StreamUserLinkModule,
        RedemptionPubSubModule,
        RedemptionUserLinkModule,
        ChatPubSubModule,
        ChatUserLinkModule,
        BitPubSubModule,
        BitUserLinkModule,
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
