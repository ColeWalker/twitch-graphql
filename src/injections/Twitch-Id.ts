import 'reflect-metadata'
import { InjectionToken } from 'graphql-modules'

export const TwitchId = new InjectionToken<string>('twitch-id')
