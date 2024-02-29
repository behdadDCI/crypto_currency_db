import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { dbConnect } from "./configs/dbConnect"
import userRouter from "./routes/userRouter"
import { errorHandler, notFound } from "./middlewares/error/errorHandler"

dotenv.config()
dbConnect()

const app=express()
//adel
app.use(express.json())
app.use(cors({credentials:true,origin:"orosia.online"}))
app.use(cookieParser())


app.use(userRouter)

app.use(notFound)
app.use(errorHandler)

const port=process.env.PORT || 3002

app.listen(port,()=>console.log(`Server is Running on Port: ${port}`))


