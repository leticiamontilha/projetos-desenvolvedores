import express, { Application } from "express";
import { starDataBase } from "./database"
import { createDeveloper, createInfoDeveloper, deleteDeveloper, getAllDevs, getAllProjectsByDevId, getDevById, updateDeveloper, updateDevInfos } from "./logics/developers.logics"
import { emailExist, idExist } from "./middlewares/developers.middlewares"
import { idProjectExist } from "./middlewares/projects.middlewares"
import { createProject, deleteProject, getAllProjects, getProjectById, updateProject } from "./logics/projects.logics"


const app: Application = express()
app.use(express.json())

app.post("/developers", emailExist, createDeveloper)
app.get("/developers", getAllDevs)
app.get("/developers/:id", idExist, getDevById)
app.get("/developers/:id/projects", idExist, getAllProjectsByDevId)
app.patch("/developers/:id", idExist, emailExist, updateDeveloper)
app.delete("/developers/:id", idExist, deleteDeveloper)
app.post("/developers/:id/infos", idExist, createInfoDeveloper)
app.patch("/developers/:id/infos", idExist, updateDevInfos)


app.post("/projects", createProject)
app.get("/projects", getAllProjects)
app.get("/projects/:id", idProjectExist, getProjectById) 
app.patch("/projects/:id", idProjectExist, updateProject)
app.delete("/projects/:id", idProjectExist, deleteProject)
app.post("/projects/:id/technologies", idProjectExist)
app.delete("/projects/:id/technologies/:name", idProjectExist)


app.listen(3000, async () => {
    await starDataBase()
    console.log("server is running!")
})