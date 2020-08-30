import 'reflect-metadata'
import { Injectable } from 'graphql-modules'

@Injectable()
export class UserId {
  id() {
    return process.env.USER_ID || ''
  }
}
