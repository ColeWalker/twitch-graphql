import 'reflect-metadata'
import { InjectionToken } from 'graphql-modules'

export const UserId = new InjectionToken<string>('user-id')
