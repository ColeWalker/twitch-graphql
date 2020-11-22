import { UserResolvers } from './user-type-schema'
import nock from 'nock'
import {
  expectedUserObject,
  expectedUserRaw,
  helixSubRaw,
  krakenSubRaw,
  userFollowObject,
  userFollowsObject,
  userFollowsRaw,
  contextValue,
  authenticationMock,
  validationMock,
} from '../tests/mocks'
import {
  ApiClient,
  HelixBroadcasterType,
  HelixFollow,
  HelixUser,
  HelixUserType,
} from 'twitch'
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
  .get('/helix/users/follows')
  .query(true)
  .reply(200, userFollowsRaw)
  .persist()

describe('UserModule', () => {
  it('getUserById should work', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }
    const user = await UserResolvers.Query.getUserById(
      {},
      { userId: '123' },
      contextWithClient
    )

    expect({
      id: user?.id,
      displayName: user?.displayName,
      description: user?.description,
      profilePictureURL: user?.profilePictureUrl,
      views: user?.views,
    }).toMatchObject(expectedUserObject)
  })

  it('getUserByDisplayName should work', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }
    const user = await UserResolvers.Query.getUserByDisplayName(
      {},
      { displayName: '123' },
      contextWithClient
    )

    expect({
      id: user?.id,
      displayName: user?.displayName,
      description: user?.description,
      profilePictureURL: user?.profilePictureUrl,
      views: user?.views,
    }).toMatchObject(expectedUserObject)
  })
})

describe('follows', () => {
  it('followsId should work', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }
    const follows = await UserResolvers.User.followsId(
      new HelixUser(
        {
          ...expectedUserRaw,
          type: HelixUserType.None,
          broadcaster_type: HelixBroadcasterType.Affiliate,
        },

        contextWithClient.twitchClient
      ),
      { userId: '123' }
    )
    expect(follows).toBe(true)
  })

  it('followsDisplayName should work', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }
    const follows = await UserResolvers.User.followsDisplayName(
      new HelixUser(
        {
          ...expectedUserRaw,
          type: HelixUserType.None,
          broadcaster_type: HelixBroadcasterType.Affiliate,
        },

        contextWithClient.twitchClient
      ),
      { displayName: '123' },
      contextWithClient
    )
    expect(follows).toBe(true)
  })
  it('follows should work', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }
    const follows = await UserResolvers.User.follows(
      new HelixUser(
        {
          ...expectedUserRaw,
          type: HelixUserType.None,
          broadcaster_type: HelixBroadcasterType.Affiliate,
        },

        contextWithClient.twitchClient
      ),
      { maxPages: 1 },
      contextWithClient
    )

    expect({
      cursor: 'xxx',
      total: 2,
      nodes: follows?.nodes?.map((x: HelixFollow) => ({
        followDate: x.followDate.toDateString(),
        followDateUTC: new Date(x.followDate).getTime().toString(),
      })),
    }).toMatchObject(userFollowsObject)
  })
  it('getFollowToId should work', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }
    const follow = await UserResolvers.User.getFollowToId(
      new HelixUser(
        {
          ...expectedUserRaw,
          type: HelixUserType.None,
          broadcaster_type: HelixBroadcasterType.Affiliate,
        },

        contextWithClient.twitchClient
      ),
      { userId: '123' }
    )
    expect({
      followDate: follow?.followDate.toDateString(),
      followDateUTC:
        follow?.followDate && new Date(follow?.followDate).getTime().toString(),
    }).toMatchObject(userFollowObject)
  })

  it('getFollowToDisplayName should work', async () => {
    const authProvider = await RefreshToken('a', 'b', 'c')
    const contextWithClient = {
      ...contextValue,
      authProvider,
      twitchClient: new ApiClient({ authProvider }),
    }
    const follow = await UserResolvers.User.getFollowToId(
      new HelixUser(
        {
          ...expectedUserRaw,
          type: HelixUserType.None,
          broadcaster_type: HelixBroadcasterType.Affiliate,
        },

        contextWithClient.twitchClient
      ),
      { userId: '123' }
    )
    expect({
      followDate: follow?.followDate.toDateString(),
      followDateUTC:
        follow?.followDate && new Date(follow?.followDate).getTime().toString(),
    }).toMatchObject(userFollowObject)

    // const follow = result?.data?.latestSub?.user?.getFollowToDisplayName
  })
})
