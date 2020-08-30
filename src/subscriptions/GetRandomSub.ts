import ApiClient, { HelixSubscription } from 'twitch'

export const getRandomSub = async (
  userId: string,
  twitchClient: ApiClient
): Promise<HelixSubscription> => {
  const subscriptions = await twitchClient.helix.subscriptions.getSubscriptions(
    userId
  )
  const max = subscriptions.data.length
  const random = Math.floor(Math.random() * max)
  return subscriptions.data[random]
}
