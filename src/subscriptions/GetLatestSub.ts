import { ApiClient, HelixSubscription, TwitchAPICallType } from 'twitch'

interface SubscriptionWrapper {
  _total: number
  subscriptions: SubscriptionData[]
}

interface SubscriptionData {
  created_at: string
  broadcaster_name: string
  _id: '1e328f31280778ae3866ec93b276551582291a0d'
  sub_plan: '1000'
  sub_plan_name: 'Codemonkey'
  is_gift: false
  user: RawUser
  sender: null
}

interface RawUser {
  display_name: 'aussieboi'
  type: string
  bio: string
  created_at: string
  updated_at: string
  _id: string
  name: string
  logo: string
}

export const getLatestSub = async (
  userId: string,
  twitchClient: ApiClient
): Promise<HelixSubscription> => {
  const subscriptions: SubscriptionWrapper = await twitchClient.callApi({
    url: `channels/${userId}/subscriptions?limit=1&direction=desc`,
    type: TwitchAPICallType.Kraken,
  })

  const helixSubs = await twitchClient.helix.subscriptions.getSubscriptions(
    userId
  )

  const sub = helixSubs.data.find(
    (h) => h.userId === subscriptions.subscriptions?.[0]?.user?._id
  )

  return sub || helixSubs.data[helixSubs.data.length - 1]
}
