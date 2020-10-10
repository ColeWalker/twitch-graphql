import { PubSubClient } from 'twitch-pubsub-client/lib'

export default async function (channelID: string, pubSubClient: PubSubClient) {
  return await pubSubClient.onRedemption(channelID, (message) => {
    const reward = message.rewardName
    switch (reward) {
      case 'Show your name on screen':
    }
  })
}
