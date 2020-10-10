import { ApiClient, HelixSubscription, TwitchAPICallType } from 'twitch'

interface SubscriptionWrapper {
  data: SubscriptionData[]
}

interface SubscriptionData {
  broadcaster_name: string
  is_gift: boolean
  tier: string
  plan_name: string
  user_id: string
  user_name: string
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
    (h) => h.userId === subscriptions?.data?.[0]?.user_id
  )

  return sub || helixSubs.data[helixSubs.data.length - 1]
}
