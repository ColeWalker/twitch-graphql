import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { StreamModule } from './stream-type-schema'
import { GameModule } from './game-type-schema'
import { parse, execute } from 'graphql'
import { QueryModule } from './query-type-schema'
describe('GameModule', () => {
  it('game should have all fields', async () => {
    const app = createApplication({
      modules: [
        QueryModule,
        SubscriberModule,
        UserModule,
        StreamModule,
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

    const game = result?.data?.latestSub?.user?.stream?.game
    if (game) {
      expect(game).toHaveProperty('boxArtUrl')
      expect(game).toHaveProperty('name')
      expect(game).toHaveProperty('id')
    }
  })
  it('can search game with getGameByName', async () => {
    const app = createApplication({
      modules: [
        QueryModule,
        SubscriberModule,
        UserModule,
        StreamModule,
        GameModule,
      ],
    })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        getGameByName(gameName: "Science & Technology") {
          id
          boxArtUrl
          name
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
    const game = result?.data?.getGameByName
    if (game) {
      expect(game).toHaveProperty('boxArtUrl')
      expect(game).toHaveProperty('name')
      expect(game).toHaveProperty('id')
      expect(game).toMatchObject({
        boxArtUrl:
          'https://static-cdn.jtvnw.net/ttv-boxart/Science%20&%20Technology-{width}x{height}.jpg',
        id: '509670',
        name: 'Science & Technology',
      })
    }
  })
})
