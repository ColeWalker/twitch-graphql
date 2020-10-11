import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { StreamModule } from './stream-type-schema'
import { GameModule } from './game-type-schema'
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
} from '../tests/mocks'
import { StreamUserLinkModule } from './stream-user-link-type-schema'

jest.setTimeout(30000)

nock('https://api.twitch.tv')
  .get('/helix/users')
  .reply(200, {
    data: [expectedUserRaw],
  })
  .persist()
nock('https://api.twitch.tv')
  .get(/\/kraken\/channels\/[0-9]*\/subscriptions/)
  .reply(200, krakenSubRaw)
  .persist()
nock('https://api.twitch.tv')
  .get('/helix/subscriptions')
  .reply(200, helixSubRaw)
  .persist()
nock('https://api.twitch.tv')
  .get('/helix/streams')
  .reply(200, helixStreamRaw)
  .persist()
nock('https://api.twitch.tv')
  .get('/helix/games')
  .reply(200, helixGameRaw)
  .persist()

describe('GameStreamLinkModule', () => {
  it('game should have all fields', async () => {
    const app = createApplication({
      modules: [
        QueryModule,
        SubscriberModule,
        UserModule,
        UserSubscriberLinkModule,
        StreamModule,
        StreamUserLinkModule,
        GameStreamLinkModule,
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
    const contextValue = { request: {}, response: {} }
    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()

    const game = result?.data?.latestSub?.user?.stream?.game
    expect(game).toMatchObject(expectedGame)
  })
})
