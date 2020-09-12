import { createModule, gql } from 'graphql-modules'

export const QueryResolvers = {
  Query: {
    _: () => false,
  },
}

export const QuerySchema = gql`
  type Query {
    _: Boolean
  }
`

export const QueryModule = createModule({
  id: `query-module`,
  dirname: __dirname,
  typeDefs: QuerySchema,
  resolvers: QueryResolvers,
})
