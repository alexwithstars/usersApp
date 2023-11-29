// imports ----------
import express  from "express"
import {createUserRouter} from "./routes/users.js"
import {viewRouter} from "./routes/view.js"
import {cors} from "./middlewares/cors.js"


export function createApp({userModel}){
	// init ----------
	const app=express()
	app.disable("x-powered-by")
	app.use(express.json())

	// cors ----------
	app.use(cors)

	// users ----------
	app.use("/users",createUserRouter({userModel}))

	// view ----------
	app.use("/view",viewRouter)

	// Errors ----------
	app.use((req,res)=>{
		res.status(404).json({error: "Resource not found"})
	})
	app.use((err,req,res,next)=>{
		res.json({error:err})
	})

	// listen ----------
	const PORT = process.env.PORT ?? 3000
	const server = app.listen(PORT,()=>{
		const addres = server.address()
		console.log(`listening on http://${(addres.address=="::" ? "localhost":addres.address)}:${PORT}`)
	})
}

import {UserModel} from "./models/mysql/user.js"
createApp({userModel:UserModel})