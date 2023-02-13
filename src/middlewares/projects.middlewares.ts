import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import { projectResult } from "../interfaces/projects.interfaces";

export const validateKeysDataProject = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    const keys: Array<string> = Object.keys(request.body)
    const requiredKeys: Array<string> = ["name", "description", "estimatedTime", "repository", "startDate", "developerId"]

    const containsAllProjects: boolean = keys.every((key: string) => {
        return requiredKeys.includes(key)
    });

    if(!containsAllProjects){
        return response.status(400).json({
         message: `As chaves ${requiredKeys} são obrigatórias`
        })
     }

     return next();

}

export const idProjectExist = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    const projectId: number = Number(request.params.id)

    const queryString: string = `
    SELECT
       *
    FROM
       projects
    WHERE
       id = $1;
    `

    const queryConfig: QueryConfig = {
       text: queryString,
       values: [projectId]
    }

    const queryResult: projectResult = await client.query(queryConfig)

    const idExist = queryResult.rows.find(el => el.id === projectId)

    if(!idExist){
       return response.status(440).json({
           message: `O projeto não existe`
          })
    }


   return next()
}
