export const userFollowObject = {
  followDateUTC: new Date('2017-08-22T22:55:24Z').getTime().toString(),
  followDate: new Date('2017-08-22T22:55:24Z').toDateString(),
}
export const userFollowsRaw = {
  total: 2,
  data: [
    {
      from_id: '123',
      from_name: 'IIIsutha067III',
      to_id: '321',
      to_name: 'LIRIK',
      followed_at: '2017-08-22T22:55:24Z',
    },
    {
      from_id: '321',
      from_name: 'Birdman616',
      to_id: '123',
      to_name: 'LIRIK',
      followed_at: '2017-08-22T22:55:24Z',
    },
  ],
  pagination: {
    cursor: 'xxx',
  },
}
export const helixStreamRaw = {
  data: [
    {
      id: '26007494656',
      user_id: '23161357',
      user_name: 'LIRIK',
      game_id: '417752',
      type: 'live',
      title: "Hey Guys, It's Monday - Twitter: @Lirik",
      viewer_count: 32575,
      started_at: '2017-08-14T16:08:32Z',
      language: 'en',
      thumbnail_url:
        'https://static-cdn.jtvnw.net/previews-ttv/live_user_lirik-{width}x{height}.jpg',
      tag_ids: ['6ea6bca4-4712-4ab9-a906-e3336a9d8039'],
    },
  ],
  pagination: {
    cursor: 'eyJiIjpudWxsLCJhIjp7Ik9mZnNldCI6MjB9fQ==',
  },
}

export const expectedStream = {
  language: 'en',
  gameId: '417752',
  id: '26007494656',
  title: "Hey Guys, It's Monday - Twitter: @Lirik",
  viewers: 32575,
  thumbnailUrl:
    'https://static-cdn.jtvnw.net/previews-ttv/live_user_lirik-{width}x{height}.jpg',
  userDisplayName: 'LIRIK',
  userId: '23161357',
}
export const userFollowsObject = {
  total: 2,
  nodes: [
    {
      followDateUTC: new Date('2017-08-22T22:55:24Z').getTime().toString(),
      followDate: new Date('2017-08-22T22:55:24Z').toDateString(),
    },
    {
      followDateUTC: new Date('2017-08-22T22:55:24Z').getTime().toString(),
      followDate: new Date('2017-08-22T22:55:24Z').toDateString(),
    },
  ],
  cursor: 'xxx',
}

export const helixSubRaw = {
  data: [
    {
      broadcaster_id: '123',
      broadcaster_name: 'test_user',
      is_gift: true,
      tier: '1000',
      plan_name: 'The Ninjas',
      user_id: '123',
      user_name: 'snoirf',
    },
    {
      broadcaster_id: '123',
      broadcaster_name: 'test_user',
      is_gift: true,
      tier: '1000',
      plan_name: 'The Ninjas',
      user_id: '1234',
      user_name: 'other_guy',
    },
  ],
  pagination: {
    cursor: 'xxxx',
  },
}
export const expectedAllSubs = [
  {
    isGift: true,
    tier: 1000,
    userId: '123',
    userDisplayName: 'snoirf',
  },
  {
    isGift: true,
    tier: 1000,
    userId: '1234',
    userDisplayName: 'other_guy',
  },
]

export const krakenSubRaw = {
  _id: 'ac2f1248993eaf97e71721458bd88aae66c92330',
  sub_plan: '3000',
  sub_plan_name: 'Channel Subscription (forstycup) - $24.99 Sub',
  channel: {
    _id: '123',
    broadcaster_language: 'en',
    created_at: '2011-01-16T04:35:51Z',
    display_name: 'IIIsutha067III',
    followers: 397,
    game: 'Final Fantasy XV',
    language: 'en',
    logo:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/forstycup-profile_image-940fb4ca1e5949c0-300x300.png',
    mature: true,
    name: 'IIIsutha067III',
    partner: true,
    profile_banner: null,
    profile_banner_background_color: null,
    status: "[Blind] Moar Sidequests! Let's explore.",
    updated_at: '2017-04-06T09:00:41Z',
    url: 'http://localhost:3000/forstycup',
    video_banner:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/forstycup-channel_offline_image-f7274322063da225-1920x1080.png',
    views: 5705,
  },
  created_at: '2017-04-08T19:54:24Z',
}

export const expectedUserRaw = {
  id: '123',
  login: 'dallas',
  display_name: 'IIIsutha067III',
  type: 'staff',
  broadcaster_type: '',
  description: 'Just a gamer playing games and chatting. :)',
  profile_image_url:
    'https://static-cdn.jtvnw.net/jtv_user_pictures/dallas-profile_image-1a2c906ee2c35f12-300x300.png',
  offline_image_url:
    'https://static-cdn.jtvnw.net/jtv_user_pictures/dallas-channel_offline_image-1a2c906ee2c35f12-1920x1080.png',
  view_count: 191836881,
  email: 'login@provider.com',
}

export const expectedUserObject = {
  id: '123',
  displayName: 'IIIsutha067III',
  description: 'Just a gamer playing games and chatting. :)',
  profilePictureURL:
    'https://static-cdn.jtvnw.net/jtv_user_pictures/dallas-profile_image-1a2c906ee2c35f12-300x300.png',
  views: 191836881,
}
