import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import { IDeveloperRequest, DeveloperResult } from "../interfaces/developers.interfaces"

export const validateKeysDataDev = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    const keys: Array<string> = Object.keys(request.body)
    const requiredKeys: Array<string> = ["name", "email"]

    const containsAllDev: boolean = keys.every((key: string) => {
        return requiredKeys.includes(key)
    });

    if(!containsAllDev){
        return response.status(400).json({
         message: `As chaves ${requiredKeys} são obrigatórias`
        })
     }

     return next();

}

export const emailExist = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
    const devDataRequest: IDeveloperRequest = request.body

    const queryString = `
    SELECT 
        *
    FROM 
        developers
    WHERE
        email = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [devDataRequest.email]
    }

    const queryResult: DeveloperResult = await client.query(queryConfig)

    const emailExist = queryResult.rows.find(el => el.email === devDataRequest.email)

    if(emailExist){
        return response.status(409).json({
         message: `O email ${devDataRequest.email} já esta vinculado a um dev existente`
        })
    }

    return next()
}

export const idExist = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {
     const devId: number = Number(request.params.id)

     const queryString: string = `
     SELECT
        *
     FROM
        developers
    WHERE
        id = $1;
     `

     const queryConfig: QueryConfig = {
        text: queryString,
        values: [devId]
     }

     const queryResult: DeveloperResult = await client.query(queryConfig)

     const idExist = queryResult.rows.find(el => el.id === devId)

     if(!idExist){
        return response.status(440).json({
            message: `O desenvolvedor não existe`
           })
     }


    return next()
}

