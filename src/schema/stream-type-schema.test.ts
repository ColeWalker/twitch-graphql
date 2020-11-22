import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { StreamModule, StreamResolvers } from './stream-type-schema'
import { parse, execute } from 'graphql'
import { QueryModule } from './query-type-schema'
import { UserSubscriberLinkModule } from './user-subscriber-link-type-schema'
import { StreamUserLinkModule } from './stream-user-link-type-schema'
import nock from 'nock'
import {
  expectedStream,
  expectedUserRaw,
  helixStreamRaw,
  helixSubRaw,
  krakenSubRaw,
  contextValue,
  authenticationMock,
  validationMock,
} from '../tests/mocks'
import { ApiClient, HelixStream } from 'twitch'
import RefreshToken from '../helpers/RefreshToken'
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

nock('https://api.twitch.tv')
  .get('/helix/streams')
  .query(true)
  .reply(200, helixStreamRaw)
  .persist()
describe('StreamModule', () => {
  it('stream should have all fields', async () => {
    const app = createApplication({
      modules: [
        QueryModule,
        SubscriberModule,
        UserModule,
        UserSubscriberLinkModule,
        StreamModule,
        StreamUserLinkModule,
      ],
    })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        latestSub {
          user{
            displayName
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

    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    const stream = result?.data?.latestSub?.user?.stream
    expect(stream).toMatchObject(expectedStream)
  })

  it('getStreams', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }

    const rawStreams = (
      await StreamResolvers.Query.getStreams(
        {},
        { streamFilter: { userNames: ['hello world'] }, maxPages: 1 },
        contextWithClient
      )
    ).nodes.map((x: HelixStream) => ({
      language: x.language,
      gameId: x.gameId,
      id: x.id,
      title: x.title,
      viewers: x.viewers,
      thumbnailUrl: x.thumbnailUrl,
      userDisplayName: x.userDisplayName,
      userId: x.userId,
    }))

    expect(rawStreams).toMatchObject([expectedStream])
  })
})
