import { createApplication } from 'graphql-modules'
import { SubscriberModule } from './subscriber-type-schema'
import { UserModule } from './user-type-schema'
import { parse, execute } from 'graphql'
import { QueryModule } from './query-type-schema'

describe('UserModule', () => {
  it('user should have all fields', async () => {
    const app = createApplication({
      modules: [QueryModule, SubscriberModule, UserModule],
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
  it('getUserById should work', async () => {
    const app = createApplication({
      modules: [QueryModule, SubscriberModule, UserModule],
    })
    const schema = app.createSchemaForApollo()

    const userId = '23573216'
    const displayName = 'SupCole'

    const document = parse(`
      {
        getUserById(userId: "${userId}"){
            displayName
            description
            id
            profilePictureURL
            views
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
    const user = result?.data?.getUserByDisplayName
    if (user) {
      expect(user).toHaveProperty('description')
      expect(user).toHaveProperty('profilePictureURL')
      expect(user).toHaveProperty('views')

      expect(user).toMatchObject({ id: userId, displayName })
    }
  })
  it('getUserByDisplayName should work', async () => {
    const app = createApplication({
      modules: [QueryModule, SubscriberModule, UserModule],
    })
    const schema = app.createSchemaForApollo()

    const displayName = 'SupCole'
    const userId = '23573216'

    const document = parse(`
      {
        getUserByDisplayName(displayName: "${displayName}"){
            displayName
            description
            id
            profilePictureURL
            views
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
    const user = result?.data?.getUserByDisplayName
    if (user) {
      expect(user).toHaveProperty('description')
      expect(user).toHaveProperty('profilePictureURL')
      expect(user).toHaveProperty('views')

      expect(user).toMatchObject({ id: userId, displayName })
    }
  })
  it('getFollowToId should work', async () => {
    const app = createApplication({
      modules: [QueryModule, SubscriberModule, UserModule],
    })
    const schema = app.createSchemaForApollo()

    const userId = '23573216'

    const document = parse(`
      {
        latestSub {
          user {
            displayName
            getFollowToId(userId: "${userId}"){
              followDate
              followDateUTC
              
              followerUser{
                displayName
              }

              followedUser{
                displayName
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

    const follow = result?.data?.latestSub?.user?.getFollowTo
    if (follow) {
      expect(follow).toHaveProperty('followDate')
      expect(follow).toHaveProperty('followDateUTC')

      expect(follow).toHaveProperty('followerUser')
      expect(follow.followerUser).toHaveProperty('displayName')

      expect(follow).toHaveProperty('followedUser')
      expect(follow.followedUser).toHaveProperty('displayName')
    }
  })
  it('getFollowToDisplayName should work', async () => {
    const app = createApplication({
      modules: [QueryModule, SubscriberModule, UserModule],
    })
    const schema = app.createSchemaForApollo()

    const displayName = 'SupCole'

    const document = parse(`
      {
        latestSub{
          user {
            displayName
            getFollowToDisplayName(displayName: "${displayName}"){
              followDate
              followDateUTC
              
              followerUser{
                displayName
              }

              followedUser{
                displayName
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
    const follow = result?.data?.latestSub?.user?.getFollowTo
    if (follow) {
      expect(follow).toHaveProperty('followDate')
      expect(follow).toHaveProperty('followDateUTC')

      expect(follow).toHaveProperty('followerUser')
      expect(follow.followerUser).toHaveProperty('displayName')

      expect(follow).toHaveProperty('followedUser')
      expect(follow.followedUser).toHaveProperty('displayName')
    }
  })
  it('followsId should work', async () => {
    const app = createApplication({
      modules: [QueryModule, SubscriberModule, UserModule],
    })
    const schema = app.createSchemaForApollo()

    const userId = '23573216'

    const document = parse(`
      {
        latestSub{
          user {
            displayName
            followsId(userId: "${userId}")
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
    const follows = result?.data?.latestSub?.user?.followsId
    expect(typeof follows).toBe('boolean')
  })
  it('followsDisplayName should work', async () => {
    const app = createApplication({
      modules: [QueryModule, SubscriberModule, UserModule],
    })
    const schema = app.createSchemaForApollo()

    const displayName = 'SupCole'

    const document = parse(`
      {
        latestSub{
          user {
            displayName
            followsDisplayName(displayName: "${displayName}")
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
    const follows = result?.data?.latestSub?.user?.followsDisplayName
    expect(typeof follows).toBe('boolean')
  })
  it('follows should work', async () => {
    const app = createApplication({
      modules: [QueryModule, SubscriberModule, UserModule],
    })
    const schema = app.createSchemaForApollo()

    const displayName = 'SupCole'

    const document = parse(`
      {
        getUserByDisplayName(displayName: "${displayName}"){
          displayName
          follows(maxPages: 1) {
            total
            nodes
            cursor
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
    const follows = result?.data?.getUserByDisplayName?.follows
    if (follows) {
      expect(typeof follows?.total).toEqual('number')
      expect(follows).toHaveProperty('nodes')
      expect(follows).toHaveProperty('cursor')
    }
  })
})
