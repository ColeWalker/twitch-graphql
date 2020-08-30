import 'reflect-metadata'
import { Injectable } from 'graphql-modules'
require('dotenv').config()

@Injectable()
export class TwitchId {
  id() {
    return process.env.TWITCH_ID || ''
  }
}
