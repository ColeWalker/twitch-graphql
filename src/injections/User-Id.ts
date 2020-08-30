import 'reflect-metadata'
import { Injectable } from 'graphql-modules'
require('dotenv').config()

@Injectable()
export class UserId {
  id() {
    return process.env.USER_ID || ''
  }
}
