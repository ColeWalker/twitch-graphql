import ApiClient, { HelixSubscription, TwitchAPICallType } from 'twitch'

export const getLatestSub = async (
  userId: string,
  twitchClient: ApiClient
): Promise<HelixSubscription> => {
  const subscriptions = await twitchClient.callAPI({
    url: `channels/${userId}/subscriptions?limit=1&direction=desc`,
    type: TwitchAPICallType.Kraken,
  })

  const allSubs = await twitchClient.helix.subscriptions.getSubscriptions(
    userId
  )

  const sub = allSubs.data.find(
    (h) => h.userId === subscriptions.subscriptions[0].user._id
  )

  return sub || allSubs.data[allSubs.data.length - 1]
}
