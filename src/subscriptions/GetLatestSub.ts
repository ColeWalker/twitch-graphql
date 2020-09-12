import { ApiClient, HelixSubscription, TwitchAPICallType } from 'twitch'

export const getLatestSub = async (
  userId: string,
  twitchClient: ApiClient
): Promise<HelixSubscription> => {
  const subscriptions = await twitchClient.callApi({
    url: `channels/${userId}/subscriptions?limit=1&direction=desc`,
    type: TwitchAPICallType.Kraken,
  })

  const helixSubs = await twitchClient.helix.subscriptions.getSubscriptions(
    userId
  )

  const sub = helixSubs.data.find(
    (h) => h.userId === subscriptions.subscriptions[0].user._id
  )

  return sub || helixSubs.data[helixSubs.data.length - 1]
}
