import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { StreamModule } from './stream-type-schema'
import { GameModule } from './game-type-schema'
import { parse, execute } from 'graphql'
describe('GameModule', () => {
  it('game should have all fields', async () => {
    const app = createApplication({
      modules: [SubscriberModule, UserModule, StreamModule, GameModule],
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
})
