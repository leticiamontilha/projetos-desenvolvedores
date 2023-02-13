import { client } from "./config"

export const starDataBase = async(): Promise<void> => {
    await client.connect()
    console.log("DataBase conected!")
}