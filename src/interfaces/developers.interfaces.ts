import { QueryResult } from "pg"

export interface IDeveloperRequest {
    name: string,
    email: string
}

export interface IDeveloper extends IDeveloperRequest{
    id: number
}

export interface IDeveloperInfoRequest {
    developerSince: string,
    preferredOS: string
}

export interface IInfoDev extends IDeveloperInfoRequest{
    id: number
}

export type ItensDevRequiredKeys = "name" | "email"
export type DeveloperResult = QueryResult<IDeveloper>
export type InfoResult = QueryResult<IInfoDev>