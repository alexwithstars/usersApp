import {validateUser,userCredentials,partialValidateUser}  from "../schemas/users.js"

export class UserController{
	constructor({userModel}){
		this.userModel=userModel
	}
	getAll = async (req,res,next) => {
		const users = await this.userModel.getAll()
		if(users) return res.json(users)
		next()
	}
	verify = async (req,res,next) => {
		const credentials = await userCredentials(req.body)
		if(credentials.error){
			res.status(400)
			return next(credentials.error.issues)
		}
		const user = await this.userModel.verify({input:credentials.data})
		if(user) return res.json(user)
		res.status(404)
		next("Incorrect username or password")
	}
	create = async (req,res,next) => {
		const user =await validateUser(req.body)
		if(user.error){
			res.status(400)
			return next(user.error.issues)
		}
		const response = await this.userModel.create({input:user.data})
		if(response) return res.status(201).json(response)
		if(response==null) {
			const users = await this.userModel.getAll()
			if(users.includes(user.data.username)){
				res.status(400)
				return next("username already taken")
			}
			res.status(400)
			return next("email is already used by another account")
		}
		res.status(500)
		next("server fail")
	}
	delete = async (req,res,next) => {
		const credentials = await userCredentials(req.body)
		if(credentials.error){
			res.status(400)
			return next(credentials.error.issues)
		}
		const stat = await this.userModel.delete({input:credentials.data})
		if(!stat){
			res.status(404)
			return next("User not found")
		}
		const response = {message:`User ${stat} deleted`}
		res.json(response)
	}
	update = async (req,res,next) => {
		const newData = await partialValidateUser(req.body)
		if(newData.error){
			res.status(400)
			return next(newData.error.issues)
		}
		const response = await this.userModel.update({input:newData.data})
		if(!response){
			res.status(404)
			return next("User not found")
		}
		res.json(response)
	}
}