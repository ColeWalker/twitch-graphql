import 'reflect-metadata'
import { Injectable } from 'graphql-modules'

@Injectable()
export class TwitchId {
  id() {
    return process.env.TWITCH_ID || ''
  }
}
