import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { dbConnect } from "./configs/dbConnect"
import userRouter from "./routes/userRouter"
import { errorHandler, notFound } from "./middlewares/error/errorHandler"
import apiRouter from "./routes/apiRouter"
import coinRouter from "./routes/coinRouter"

dotenv.config()
dbConnect()

const app=express()
//adel
app.use(express.json())
 app.use(cors({credentials:true,origin:["http://localhost:3000","https://orosia.online"]}))
app.use(cookieParser())


app.use(userRouter)
app.use(apiRouter)
app.use(coinRouter)

app.use(notFound)
app.use(errorHandler)

const port=process.env.PORT || 3002

app.listen(port,()=>console.log(`Server is Running on Port: ${port}`))


