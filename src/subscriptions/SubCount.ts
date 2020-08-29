import ApiClient from 'twitch'

export async function getCurrentSubCount(
  userId: string,
  twitchClient: ApiClient
) {
  const subscriptions = await twitchClient.helix.subscriptions.getSubscriptions(
    userId
  )
  const subCount = subscriptions.data.length - 1

  return subCount
}
