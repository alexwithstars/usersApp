"use strict";
import {Notify} from "./notify.js"
const qse = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

const logmodel = gti("logmodel")
const signmodel = gti("signmodel")
const formSign = gti("formSign")
const title = qse("#form > h2")
const sub = gti("send")
const form = gti("form")
const loading = gti("loading")
const username = gti("username")
const password = gti("password")
const email = gti("email")
const confirm = gti("confirm")
const allInps = qsa("#form input")
const content = qse("main")
const newcontent = qse(".logmodal")
let create = false

const logged = `
<p>We don't have nothing to show you but you logged in, be happy</p>
<img src="./assets/images/done.png" alt="logged">
<a href=${location.href}>Reload</a>`

logmodel.addEventListener("click",()=>{
	signmodel.classList.remove("active")
	logmodel.classList.add("active")
	allInps.forEach(entrie=>entrie.classList.remove("sig"))
	create=false
	formSign.style.display="none"
	qsa("#formSign input").forEach(entrie=>entrie.toggleAttribute("required",false))
	title.textContent="Login"
	sub.textContent="Login"
})
signmodel.addEventListener("click",()=>{
	signmodel.classList.add("active")
	logmodel.classList.remove("active")
	formSign.style.display="flex"
	allInps.forEach(entrie=>entrie.classList.add("sig"))
	create=true
	qsa("#formSign input").forEach(entrie=>entrie.toggleAttribute("required",true))
	title.textContent="Signup"
	sub.textContent="Signup"
})

async function login(){
	const user = {
		username:username.value,
		password:password.value
	}
	try{
		const request = await fetch(`${location.origin}/users/login`,{
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify(user)
		})
		const response = await request.json()
		if(response.error){
			if(typeof response.error=="string"){
				new Notify({
					text:response.error,
					color:"#f88"
				})
				return
			}
			response.error.forEach(entrie=>{
				gti(`${entrie.path[0]}`).classList.add("invalid")
			})
			return
		}
		if(response.error){
			new Notify({
				text:"Incorrect username or password",
				color:"#f88"
			})
			return
		}
		allInps.forEach(entrie=>entrie.value='')
		new Notify({
			text:"Login completed",
			color:"#afa"
		})
		document.body.removeChild(content)
		const elem = document.createElement("div")
		elem.classList.add("logmodal")
		elem.innerHTML=logged
		document.body.appendChild(elem)
	} catch(e) {
		new Notify({
			text:"Failed fetch (check console)"
		})
		console.warn(e)
	}
}
async function signup(){
	if(password.value!=confirm.value){
		new Notify({
			text:"Diferent passwords provided",
			color:"#f88"
		})
		password.classList.add("invalid")
		confirm.classList.add("invalid")
		return
	}
	const newUser = {
		username:username.value,
		password:password.value,
		email:email.value
	}
	try{
		const request = await fetch(`${location.origin}/users/signup`,{
			method:"POST",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify(newUser)
		})
		const response = await request.json()
		if(response.error){
			if(typeof response.error=="string"){
				new Notify({
					text:response.error,
					color:"#f88"
				})
				return
			}
			response.error.forEach(entrie=>{
				gti(`${entrie.path[0]}`).classList.add("invalid")
			})
			return
		}
		allInps.forEach(entrie=>entrie.value='')
		new Notify({
			text:"User registred correctly",
			color:"#afa"
		})
	} catch(e) {
		new Notify({
			text:"Failed fetch (check console)"
		})
		console.warn(e)
	}
}

form.addEventListener("submit",async e=>{
	e.preventDefault()
	loading.classList.add("active")
	allInps.forEach(entrie=>entrie.classList.remove("invalid"))
	if(create){
		await signup()
	}
	else{
		await login()
	}
	loading.classList.remove("active")
})