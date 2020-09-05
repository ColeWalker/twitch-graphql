# Twitch GraphQL Server

This is an open source twitch API graphql wrapper. It is not currently working, but I think you can see where it's heading.

## Environment Variables

This project assumes that you already have a Twitch API App set up, and an OAuth token with every scope (this is a wrapper for the API, so we will be touching all of it). This information will be stored inside of several environment variables in a .env file. If you need a Twitch API Application (for user ID and client secret), information regarding setting one up is [documented in the Twitch API documentation.](https://dev.twitch.tv/docs/api/) If you require an OAuth or refresh token, there is [documentation available in the Twitch API documentation.](https://dev.twitch.tv/docs/authentication)

| Variable      | Value                                       |
| ------------- | ------------------------------------------- |
| SECRET        | Your application's secret                   |
| USER_ID       | Your application's User ID                  |
| TWITCH_ID     | Your Twitch account's ID                    |
| REFRESH_TOKEN | The refresh token for your OAuth token      |
| PORT          | The port that you want to run the server on |

## Command line arguments

```
-p, --port The port number that the server should use. Not available with yarn dev. [number]
```

## Code Style

This project uses tslint, commitlint, and prettier to format its code and commit messages. I recommend that you install editor plugins for all three. TSLint and Prettier will lint code, while commitlint will lint commit messages to make sure that they follow the [conventional commits standard.](https://www.conventionalcommits.org/en/v1.0.0/)

Conventional commits is a standard for commit messages. It is used in this project to make commit history easier to read at a glance, and keep everything uniform. Additionally, it can help with automated versioning down the line.

The general format is as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

More information can be found on the [conventional commits website.](https://www.conventionalcommits.org/en/v1.0.0/)
