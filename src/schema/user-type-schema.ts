import { createModule, gql } from 'graphql-modules'
import { HelixSubscription, HelixUser } from 'twitch/lib'

export const UserResolvers = {
  Subscriber: {
    async user(sub: HelixSubscription) {
      return await sub.getUser()
    },
  },
  User: {
    displayName(user: HelixUser) {
      return user.displayName
    },
    description(user: HelixUser) {
      return user.description
    },
    id(user: HelixUser) {
      return user.id
    },
    profilePictureURL(user: HelixUser) {
      return user.profilePictureUrl
    },
    views(user: HelixUser) {
      return user.views
    },
  },
}

export const UserSchema = gql`
  type User {
    displayName: String!
    description: String!
    id: String!
    profilePictureURL: String!
    views: Int!
  }

  extend type Subscriber {
    user: User!
  }
`

export const UserModule = createModule({
  id: `user-module`,
  dirname: __dirname,
  typeDefs: UserSchema,
  resolvers: UserResolvers,
})
