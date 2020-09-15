import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { QueryModule } from './schema/query-type-schema'
import { SubscriberModule } from './schema/subscriber-type-schema'
import { UserModule } from './schema/user-type-schema'
import { StreamModule } from './schema/stream-type-schema'
import { GameModule } from './schema/game-type-schema'
import { createApplication } from 'graphql-modules'
import { UserSubscriberLinkModule } from './schema/user-subscriber-link-type-schema'
import { GameStreamLinkModule } from './schema/game-stream-link-type-schema'
require('dotenv').config()

let port = 5555

const portEnv = parseInt(process?.env?.PORT || '')
if (portEnv) {
  port = portEnv
}

const portIndex =
  process?.argv?.findIndex((arg) => arg === '--port' || arg === '-p') + 1

const portCmdNum = parseInt(process?.argv?.[portIndex])

if (portCmdNum) {
  port = portCmdNum
}

let useGraphiql = false
if (process?.env?.GRAPHIQL?.toLowerCase() === 'true') {
  useGraphiql = true
}

if (
  process?.argv?.some(
    (arg) => arg.toLowerCase() === '--graphiql' || arg.toLowerCase() === '-g'
  )
) {
  useGraphiql = true
}

const app = createApplication({
  modules: [
    QueryModule,
    SubscriberModule,
    UserModule,
    StreamModule,
    UserSubscriberLinkModule,
    GameStreamLinkModule,
    GameModule,
  ],
})
const execute = app.createExecution()
const server = express()
server.use(cors())
server.use(
  '/graphql',
  graphqlHTTP((request: any) => ({
    schema: app.schema,
    graphiql: useGraphiql,
    customExecuteFn: execute as any,
    context: { request },
  }))
)

server.listen(port, () => {
  console.log(`server listening at ${port}, graphiql enabled: ${useGraphiql}`)
})
