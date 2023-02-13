import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import { DeveloperResult, IDeveloperInfoRequest, IDeveloperRequest, InfoResult } from "../interfaces/developers.interfaces";
import { projectResult } from "../interfaces/projects.interfaces";



export const createDeveloper = async (request: Request, response: Response): Promise<Response> => {
    const developerData: IDeveloperRequest = request.body

    const queryString: string = format(
    `
        INSERT INTO 
            developers (%I)
        VALUES
            (%L)
            RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
    )

    const queryResult: DeveloperResult = await client.query(queryString)

    return response.status(201).json(queryResult.rows[0])
}

export const createInfoDeveloper = async (request: Request, response: Response): Promise<Response> => {
    const infoDevData: IDeveloperInfoRequest = request.body 
    const idDeveloper: number = +request.params.id

    let queryString: string = format(
        `
        INSERT INTO 
            developer_infos (%I)
        VALUES (%L)
            RETURNING *
        `,
        Object.keys(infoDevData),
        Object.values(infoDevData)
    )
    
    let queryResult: InfoResult = await client.query(queryString)

    // queryString = `
    //     UPDATE
    //         developers
    //     SET 
    //         "developerInfoId" = $1
    //     WHERE
    //         id = $2
    //     RETURNING *;
    // `

    // const QueryConfig: QueryConfig = {
    //     text: queryString,
    //     values: [queryResult.rows[0].id, idDeveloper]
    // } 

    // queryResult = await client.query(QueryConfig)

    return response.status(201).json(queryResult.rows[0])

}

export const getAllDevs = async (request: Request, response: Response): Promise<Response> => {
    
    let queryString: string = `
    SELECT 
        d."id",
        d."name",
        d."email",
        d."developerInfoId",
        di."developerSince",
        di."preferredOS"
    FROM 
        developers d 
    LEFT JOIN 
        developer_infos di 
    ON 
        d."developerInfoId" = di.id;
    `
    const queryResult: DeveloperResult = await client.query(queryString)

    return response.status(200).json(queryResult.rows)
}

export const getDevById = async (request: Request, response: Response): Promise<Response> => {
    const idDev = request.params.id

    let queryString: string = `
    SELECT
        *
    FROM 
        developers dv
    JOIN 
        developer_infos dvi
    ON
        dv.id = dvi.id
    WHERE
        dvi.id = $1;
    `

    const QueryConfig: QueryConfig = {
        text: queryString,
        values: [idDev]
    }

    const queryResult: DeveloperResult = await client.query(QueryConfig)

    return response.status(200).json(queryResult.rows[0])
}

export const getAllProjectsByDevId = async (request:Request, response: Response): Promise<Response> => {

    const idDev: number = Number(request.params.id)

    let queryString: string = `
        SELECT 
            *
        FROM 
            developers d
        JOIN
            projects p
        ON
            d.id = p."developerId"
        WHERE
            p."developerId" = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [idDev]
    }

    const queryResult: projectResult = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows)

}

export const updateDeveloper = async (request: Request, response: Response): Promise<Response> => {
    const idDev: number = Number(request.params.id)

    const queryString: string = format(
        `
        UPDATE
            developers
        SET
            (%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
        `,
        Object.keys(request.body),
        Object.values(request.body)
    )

    const QueryConfig: QueryConfig = {
        text: queryString,
        values: [idDev]
    }

    const queryResult: DeveloperResult = await client.query(QueryConfig)

    return response.status(200).json(queryResult.rows[0])
}

export const updateDevInfos = async (request: Request, response: Response): Promise<Response> => {
    const idDev: number = Number(request.params.id)

    const queryString: string = format(
        `
        UPDATE
            developer_infos
        SET
            (%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
        `,
        Object.keys(request.body),
        Object.values(request.body)
    )

    const QueryConfig: QueryConfig = {
        text: queryString,
        values: [idDev]
    }

    const queryResult: DeveloperResult = await client.query(QueryConfig)

    return response.status(200).json(queryResult.rows[0])
}

export const deleteDeveloper = async (request: Request, response: Response): Promise<Response> => {
    const idDev: number = Number(request.params.id)

    const queryString: string = `
    DELETE 
    FROM
        developers
    WHERE
        id = $1;
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [idDev]
    }
   
    await client.query(queryConfig)

    return response.status(204).json()
}