import { ApiClient, HelixSubscription } from 'twitch'

export const getSubs = async (
  userId: string,
  twitchClient: ApiClient
): Promise<HelixSubscription[]> => {
  const subscriptions = await twitchClient.helix.subscriptions.getSubscriptions(
    userId
  )

  return [...subscriptions.data]
}
