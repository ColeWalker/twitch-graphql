# Twitch GraphQL Server

This is an open source twitch API graphql wrapper. It is not currently working, but I think you can see where it's heading.

## Environment Variables

This project assumes that you already have a Twitch API App set up, and an OAuth token with every scope (this is a wrapper for the API, so we will be touching all of it). This information will be stored inside of several environment variables in a .env file. If you need a Twitch API Application (for user ID and client secret), information regarding setting one up is [documented in the Twitch API documentation.](https://dev.twitch.tv/docs/api/) If you require an OAuth or refresh token, there is [documentation available in the Twitch API documentation.](https://dev.twitch.tv/docs/authentication)

| Variable      | Value                                  |
| ------------- | -------------------------------------- |
| SECRET        | Your application's secret              |
| USER_ID       | Your application's User ID             |
| TWITCH_ID     | Your Twitch account's ID               |
| REFRESH_TOKEN | The refresh token for your OAuth token |
