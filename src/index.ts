import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { SubscriberModule } from './schema/subscriber-type-schema'
import { UserModule } from './schema/user-type-schema'
import { createApplication } from 'graphql-modules'
require('dotenv').config()

const app = createApplication({
  modules: [SubscriberModule, UserModule],
})
const execute = app.createExecution()
const server = express()
server.use(cors())
server.use(
  '/graphql',
  graphqlHTTP((request: any) => ({
    schema: app.schema,
    graphiql: false,
    customExecuteFn: execute as any,
    context: { request },
  }))
)

server.listen(5555)
