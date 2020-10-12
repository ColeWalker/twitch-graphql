import { SubscriberModule } from './subscriber-type-schema'
import { execute, parse } from 'graphql'
import { createApplication } from 'graphql-modules'
import { QueryModule } from './query-type-schema'
import {
  authenticationMock,
  contextValue,
  validationMock,
} from '../tests/mocks'
import nock from 'nock'
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

describe('QueryModule', () => {
  it('query module can be extended to include latestSub', async () => {
    const app = createApplication({ modules: [QueryModule, SubscriberModule] })
    const schema = app.createSchemaForApollo()

    const document = parse(`
      {
        latestSub {
          userId
          tier
          userDisplayName
          isGift
        }
      }
    `)

    const result = await execute({
      schema,
      contextValue,
      document,
    })

    expect(result?.errors?.length).toBeFalsy()
    expect(result?.data?.latestSub).toHaveProperty('tier')
    expect(result?.data?.latestSub).toHaveProperty('userId')
    expect(result?.data?.latestSub).toHaveProperty('isGift')
    expect(result?.data?.latestSub).toHaveProperty('userDisplayName')
  })
})
