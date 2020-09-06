import express from 'express'
import cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { SubscriberModule } from './schema/subscriber-type-schema'
import { UserModule } from './schema/user-type-schema'
import { StreamModule } from './schema/stream-type-schema'
import { GameModule } from './schema/game-type-schema'
import { createApplication } from 'graphql-modules'
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

const app = createApplication({
  modules: [SubscriberModule, UserModule, StreamModule, GameModule],
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

server.listen(port, () => {
  console.log(`server listening at ${port}`)
})
