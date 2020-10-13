import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { StreamModule } from './stream-type-schema'
import { GameModule, GameResolvers } from './game-type-schema'
import { parse, execute } from 'graphql'
import { QueryModule } from './query-type-schema'
import { UserSubscriberLinkModule } from './user-subscriber-link-type-schema'
import { GameStreamLinkModule } from './game-stream-link-type-schema'
import nock from 'nock'
import {
  expectedGame,
  expectedUserRaw,
  helixGameRaw,
  helixStreamRaw,
  helixSubRaw,
  krakenSubRaw,
  contextValue,
  authenticationMock,
  validationMock,
} from '../tests/mocks'
import { StreamUserLinkModule } from './stream-user-link-type-schema'
import { ApiClient, HelixGame } from 'twitch/lib'
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
nock('https://api.twitch.tv')
  .get('/helix/games')
  .query(true)
  .reply(200, helixGameRaw)
  .persist()

describe('GameModule', () => {
  it('game should have all fields', async () => {
    const app = createApplication({
      modules: [
        QueryModule,
        SubscriberModule,
        UserModule,
        UserSubscriberLinkModule,
        GameStreamLinkModule,
        StreamUserLinkModule,
        StreamModule,
        GameModule,
      ],
    })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        latestSub {
          user{
            displayName
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

    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    const game = result?.data?.latestSub?.user?.stream?.game
    expect(game).toMatchObject(expectedGame)
  })

  it('can search game with getGameByName', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }

    const rawGame = await GameResolvers.Query.getGameByName(
      {},
      { gameName: 'hello world' },
      contextWithClient
    )

    expect(rawGame).toBeTruthy()

    expect(rawGame).toMatchObject(
      new HelixGame(helixGameRaw.data[0], contextWithClient.twitchClient)
    )
  })
})
