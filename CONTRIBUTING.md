# Contributing

Contributors should be using [prettier](https://prettier.io/) to automatically format their code as they write. TSLint will automatically lint code written to make sure that it meets the [project's guidelines.](#code-style)

To contribute please follow these steps:

1. Clone the repository: `git clone https://github.com/ColeWalker/twitch-graphql-server`
2. Create a new branch named after the issue that you're going to fix. Prefix branch name with a Conventional Commits type. Example:
   `git checkout -b feature/add-port-config`
3. Write code and write tests for your code. We use jest and ts-jest. If your code is not properly covered by tests, it will be rejected. Since this is a wrapper for an external API, our tests cannot be thorough, however, you should provide as much coverage as possible. Follow any .test.ts file for examples.
4. Commit your code following the Conventional Commits standard. If your commits do not meet the standard the pull request will automatically fail.
5. Push your branch to the repository and submit a pull request with the issue linked.
6. Wait for the CI to check to make sure that your tests pass, and then if all goes well, your code will be published!

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
