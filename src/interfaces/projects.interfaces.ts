import { QueryResult } from "pg"

export interface IProjectRequest {
    name: string,
    description: string,
    estimatedTime: string,
    repository: string,
    startDate: Date,
    endDate?: Date,
    developerId: number
}

export interface IProject extends IProjectRequest{
    id: number
}

export type projectResult = QueryResult<IProject>


export type requiredKeysProject = "name" | "description" | "estimatedTime" | "repository" | "startDate"| "developerId";

export type Techs  = "JavaScript" | "Python" | "React" | "Express.js" | "HTML" | "CSS"  | "Django" |  "PostgreSQL" | "MongoDB";