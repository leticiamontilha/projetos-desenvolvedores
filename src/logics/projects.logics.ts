import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import { DeveloperResult } from "../interfaces/developers.interfaces";
import { IProjectRequest, projectResult, requiredKeysProject } from "../interfaces/projects.interfaces";

const validateDataProject= (payload: any): IProjectRequest => {

    const keys: Array<string> = Object.keys(payload)
    const requiredKeys: Array<requiredKeysProject> = [
        "name",
        "description",
        "estimatedTime",
        "repository",
        "startDate",
        "developerId"
    ]

    const containsAllList: boolean = requiredKeys.every((key: string) => {
        return keys.includes(key)
    })

    if(!containsAllList) {
        throw new Error(`As chaves sao obrigatorias: ${requiredKeys}`)
    }

    return payload
}

export const createProject = async (request: Request, response: Response): Promise<Response> => {
    try {
        const dataProject: IProjectRequest = validateDataProject(request.body)

        const queryString: string = format(
            `
                INSERT INTO 
                    projects (%I)
                VALUES
                    (%L)
                    RETURNING *;
            `,
            Object.keys(dataProject),
            Object.values(dataProject)
        )

            const idDev: number = request.body.developerId

            const devQueryString: string = `
            SELECT
            *
            FROM
            developers
        WHERE
            id = $1;
            `
    
            const queryConfigDev: QueryConfig = {
            text: devQueryString,
            values: [idDev]
            }
    
            const queryResultDev: DeveloperResult = await client.query(queryConfigDev)
    
            const idExist = queryResultDev.rows.find(el => el.id === idDev)
    
            if(!idExist){
            return response.status(440).json({
                message: `O desenvolvedor não existe`
                })
            }
            
            const queryResult: projectResult = await client.query(queryString)

            return response.status(201).json(queryResult.rows[0])

    } catch (error) {

        if(error instanceof Error){
            return response.status(400).json({
                message:error.message
            })
        }
    
        console.log(error)
        return response.status(500).json({
            message: "internal server error"
        })
        
    }
}

export const getAllProjects = async (request: Request, response: Response): Promise<Response> => {
    
    let queryString: string = `
    SELECT 
       p."id",
       p."name",
       p."description",
       p."estimatedTime",
       p."repository",
       p."startDate",
       p."endDate",
       p."developerId",
       pt."addedIn",
       pt."projectId",
       pt."technologyId"
    FROM 
        projects p 
    LEFT JOIN 
        projects_technologies pt
    ON 
        p."id" = pt."projectId";
    `
    const queryResult: projectResult = await client.query(queryString)

    return response.status(200).json(queryResult.rows)
}

export const getProjectById = async (request: Request, response: Response): Promise<Response> => {
    const idProject = +request.params.id

    let queryString: string = `
    SELECT
        *
    FROM 
        projects p
    JOIN 
        projects_technologies pt
    ON
        p.id = pt."projectId"
    WHERE
        pt."projectId" = $1;
    `

    const QueryConfig: QueryConfig = {
        text: queryString,
        values: [idProject]
    }

    const queryResult: projectResult = await client.query(QueryConfig)

    return response.status(200).json(queryResult.rows[0])
}

export const updateProject= async (request: Request, response: Response): Promise<Response> => {
    
   try {
    const data = validateDataProject(request.body)
    const idProject: number = Number(request.params.id)

    const queryString: string = format(
        `
        UPDATE
            projects
        SET
            (%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
        `,
        Object.keys(data),
        Object.values(data)
    )

    const QueryConfig: QueryConfig = {
        text: queryString,
        values: [idProject]
    }

    const queryResult: DeveloperResult = await client.query(QueryConfig)

    return response.status(200).json(queryResult.rows[0])
   } catch (error) {

    if(error instanceof Error){
        return response.status(400).json({
            message:error.message
        })
    }

    console.log(error)
    return response.status(500).json({
        message: "internal server error"
    })
    
   }
}

export const deleteProject = async (request: Request, response: Response): Promise<Response> => {
    const idProject: number = Number(request.params.id)

    const queryString: string = `
    DELETE 
    FROM
        projects
    WHERE
        id = $1;
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [idProject]
    }
   
    await client.query(queryConfig)

    return response.status(204).json()
}

