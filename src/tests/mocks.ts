export const userFollowObject = {
  followDateUTC: new Date('2017-08-22T22:55:24Z').getTime().toString(),
  followDate: new Date('2017-08-22T22:55:24Z').toDateString(),
}

export const pointsRedemptionRaw = {
  type: 'reward-redeemed',
  data: {
    timestamp: '2019-11-12T01:29:34.98329743Z',
    redemption: {
      id: '9203c6f0-51b6-4d1d-a9ae-8eafdb0d6d47',
      user: {
        id: '30515034',
        login: 'davethecust',
        display_name: 'davethecust',
      },
      channel_id: '30515034',
      redeemed_at: '2019-12-11T18:52:53.128421623Z',
      reward: {
        id: '6ef17bb2-e5ae-432e-8b3f-5ac4dd774668',
        channel_id: '30515034',
        title: 'hit a gleesh walk on stream',
        prompt: "cleanside's finest \n",
        cost: 10,
        is_user_input_required: true,
        is_sub_only: false,
        image: {
          url_1x:
            'https://static-cdn.jtvnw.net/custom-reward-images/30515034/6ef17bb2-e5ae-432e-8b3f-5ac4dd774668/7bcd9ca8-da17-42c9-800a-2f08832e5d4b/custom-1.png',
          url_2x:
            'https://static-cdn.jtvnw.net/custom-reward-images/30515034/6ef17bb2-e5ae-432e-8b3f-5ac4dd774668/7bcd9ca8-da17-42c9-800a-2f08832e5d4b/custom-2.png',
          url_4x:
            'https://static-cdn.jtvnw.net/custom-reward-images/30515034/6ef17bb2-e5ae-432e-8b3f-5ac4dd774668/7bcd9ca8-da17-42c9-800a-2f08832e5d4b/custom-4.png',
        },
        default_image: {
          url_1x:
            'https://static-cdn.jtvnw.net/custom-reward-images/default-1.png',
          url_2x:
            'https://static-cdn.jtvnw.net/custom-reward-images/default-2.png',
          url_4x:
            'https://static-cdn.jtvnw.net/custom-reward-images/default-4.png',
        },
        background_color: '#00C7AC',
        is_enabled: true,
        is_paused: false,
        is_in_stock: true,
        max_per_stream: { is_enabled: false, max_per_stream: 0 },
        should_redemptions_skip_request_queue: true,
      },
      user_input: 'yeooo',
      status: 'FULFILLED',
    },
  },
}

export const whispersEventRaw = {
  type: 'MESSAGE',
  data: {
    topic: 'whispers.44322889',
    message: {
      type: 'whisper_received',
      data: {
        id: 41,
      },
      thread_id: '129454141_44322889',
      body: 'hello',
      sent_ts: 1479160009,
      from_id: 39141793,
      tags: {
        login: 'dallas',
        display_name: 'dallas',
        color: '#8A2BE2',
        emotes: [],
        badges: [
          {
            id: 'staff',
            version: '1',
          },
        ],
      },
      recipient: {
        id: 129454141,
        username: 'dallasnchains',
        display_name: 'dallasnchains',
        color: '',
        badges: [],
      },
      nonce: '6GVBTfBXNj7d71BULYKjpiKapegDI1',
    },
    data_object: {
      id: 41,
      thread_id: '129454141_44322889',
      body: 'hello',
      sent_ts: 1479160009,
      from_id: 44322889,
      tags: {
        login: 'dallas',
        display_name: 'dallas',
        color: '#8A2BE2',
        emotes: [],
        badges: [
          {
            id: 'staff',
            version: '1',
          },
        ],
      },
      recipient: {
        id: 129454141,
        username: 'dallasnchains',
        display_name: 'dallasnchains',
        color: '',
        badges: [],
      },
      nonce: '6GVBTfBXNj7d71BULYKjpiKapegDI1',
    },
  },
}

export const bitsV1EventRaw = {
  type: 'MESSAGE',
  data: {
    topic: 'channel-bits-events-v1.44322889',
    message: {
      data: {
        user_name: 'dallasnchains',
        channel_name: 'dallas',
        user_id: '129454141',
        channel_id: '44322889',
        time: '2017-02-09T13:23:58.168Z',
        chat_message: 'cheer10000 New badge hype!',
        bits_used: 10000,
        total_bits_used: 25000,
        context: 'cheer',
        badge_entitlement: { new_version: 25000, previous_version: 10000 },
      },
      version: '1.0',
      message_type: 'bits_event',
      message_id: '8145728a4-35f0-4cf7-9dc0-f2ef24de1eb6',
    },
  },
}

export const bitsV2EventRaw = {
  type: 'MESSAGE',
  data: {
    topic: 'channel-bits-events-v2.46024993',
    message: {
      data: {
        user_name: 'jwp',
        channel_name: 'bontakun',
        user_id: '95546976',
        channel_id: '46024993',
        time: '2017-02-09T13:23:58.168Z',
        chat_message: 'cheer10000 New badge hype!',
        bits_used: 10000,
        total_bits_used: 25000,
        context: 'cheer',
        badge_entitlement: { new_version: 25000, previous_version: 10000 },
      },
      version: '1.0',
      message_type: 'bits_event',
      message_id: '8145728a4-35f0-4cf7-9dc0-f2ef24de1eb6',
      is_anonymous: true,
    },
  },
}

export const bitBadgeEventRaw = {
  type: 'MESSAGE',
  data: {
    topic: 'channel-bits-events-v1.44322889',
    message: {
      data: {
        user_name: 'dallasnchains',
        channel_name: 'dallas',
        user_id: '129454141',
        channel_id: '44322889',
        time: '2017-02-09T13:23:58.168Z',
        chat_message: 'cheer10000 New badge hype!',
        bits_used: 10000,
        total_bits_used: 25000,
        context: 'cheer',
        badge_entitlement: { new_version: 25000, previous_version: 10000 },
      },
      version: '1.0',
      message_type: 'bits_event',
      message_id: '8145728a4-35f0-4cf7-9dc0-f2ef24de1eb6',
    },
  },
}

export const subscriptionEventRaw = {
  type: 'MESSAGE',
  data: {
    topic: 'channel-subscribe-events-v1.44322889',
    message: {
      user_name: 'tww2',
      display_name: 'TWW2',
      channel_name: 'mr_woodchuck',
      user_id: '13405587',
      channel_id: '89614178',
      time: '2015-12-19T16:39:57-08:00',
      sub_plan: '1000',
      sub_plan_name: 'Channel Subscription (mr_woodchuck)',
      cumulative_months: 9,
      streak_months: 3,
      context: 'resub',
      is_gift: false,
      sub_message: {
        message: 'A Twitch baby is born! KappaHD',
        emotes: [
          {
            start: 23,
            end: 7,
            id: 2867,
          },
        ],
      },
    },
  },
}

export const giftEventRaw = {
  type: 'MESSAGE',
  data: {
    topic: 'channel-subscribe-events-v1.44322889',
    message: {
      user_name: 'tww2',
      display_name: 'TWW2',
      channel_name: 'mr_woodchuck',
      user_id: '13405587',
      channel_id: '89614178',
      time: '2015-12-19T16:39:57-08:00',
      sub_plan: '1000',
      sub_plan_name: 'Channel Subscription (mr_woodchuck)',
      months: 9,
      context: 'subgift',
      is_gift: true,
      sub_message: {
        message: '',
        emotes: null,
      },
      recipient_id: '19571752',
      recipient_user_name: 'forstycup',
      recipient_display_name: 'forstycup',
    },
  },
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

export const helixGameRaw = {
  data: [
    {
      box_art_url: 'https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-52x72.jpg',
      id: '33214',
      name: 'Fortnite',
    },
  ],
  pagination: {
    cursor: 'eyJiIjpudWxsLCJhIjp7IkN',
  },
}

export const expectedGame = {
  boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-52x72.jpg',
  id: '33214',
  name: 'Fortnite',
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
  displayName: 'dallas',
  description: 'Just a gamer playing games and chatting. :)',
  profilePictureURL:
    'https://static-cdn.jtvnw.net/jtv_user_pictures/dallas-profile_image-1a2c906ee2c35f12-300x300.png',
  views: 191836881,
}
