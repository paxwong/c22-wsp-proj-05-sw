import express from 'express'
import { userRoutes } from './routes/userRoute'
import expressSession from 'express-session'
import { client } from './utils/db'
import { checkPassword, hashPassword } from './hash'
// import fs from 'fs'
// import { uploadDir } from './utils/upload'
import { logger } from './utils/logger'
// import { memosRoutes } from './routes/memoRoute'
import http from 'http'
import { Server as SocketIO } from 'socket.io'
// import { loggingUserRoute } from './utils/guard'
import { setIO } from './utils/setIO'
// import {chatroom} from './utils/chatroom';

export const app = express()
export const server = new http.Server(app)
export const io = new SocketIO(server)
app.use(express.json())

let sessionMiddleware = expressSession({
	secret: 'kill kill kill kill kill kill kill kill kill kill kill kill kill kill kill kill kill kill',
	resave: true,
	saveUninitialized: true,
	cookie:{secure:false}
})

declare module 'express-session' {
	interface SessionData {
		name?: string
		isloggedIn?: boolean
		user ?:any
	}
}

app.use(sessionMiddleware)
io.use((socket,next)=>{
    let req = socket.request as express.Request
    let res = req.res as express.Response
    sessionMiddleware(req, res, next as express.NextFunction)
});
// SIGN UP account with unique referral code, will fail if referral code doesn't exist
app.post('/signup', async (req, res) => {
	const username = req.body.username
	const password = req.body.password
	const referral = req.body.referral

	if (!username || !password || !referral) {
		res.status(400).json({
			message: 'Missing information'
		})
		return
	}

	let result = await client.query(`SELECT * FROM REFERRAL WHERE code = $1`, [referral])
	let isReferred = result.rows[0]
	if (!isReferred) {
		res.status(400).json({
			message: 'Invalid Referral Code'
		})
		return
	}

	let hashedPassword = await hashPassword(password)
	await client.query(`INSERT INTO USERS (username, password, created_at, updated_at, account_type) values ($1, $2, NOW(), NOW(), $3)`,
		[username, hashedPassword, 'admin'])
	res.json({ message: 'User created' })
}
)

app.post('/login', async (req, res) => {
	const username = req.body.username
	const password = req.body.password
	if (!username || !password) {
		res.status(400).json({
			message: 'Missing username or password'
		})
		return
	}

	let userResult = await client.query(`SELECT * FROM users WHERE username = $1`, [username])
	let dbUser = userResult.rows[0]

	if (!dbUser) {
		res.status(400).json({
			message: 'Invalid username or password'
		})
		return
	}

	let isMatched = await checkPassword(password, dbUser.password)
	if (!isMatched) {
		res.status(400).json({
			message: 'Invalid username or password'
		})
		return
	}
	let {password: _, ...filteredUser} = dbUser
	req.session['user'] = filteredUser 
	res.status(200).json({
		message: 'Login successfully'
	})
})

// POST Contracts
app.post('/speak/:username', async(req, res)=>{
	let targetUser = req.params.username
	if (!targetUser){
		res.status(400).json({
			message:"Invalid target user"
		})
	}
	if (['killer, client'].indexOf(req.session.user.account_type) != -1  ){
		// You are either killer / client

		let result = await client.query('select * from users where username = $1', [targetUser])
		let dbUser = result.rows[0]
		if (!dbUser){
			res.status(400).json({
				message:"Invalid target user"
			})
			return
		}

		if (dbUser.account_type != 'admin'){
			res.status(400).json({
				message:"You can only speak to admin"
			})
			return
		}

		io.to(targetUser).emit('private-msg', `Msg from ${req.session.user.username}`)
	    res.end('ok')
		
	}

	

	
})

app.post('/order', async (req, res) => {
	// refer to create.js, req.body." " = ContractObject's keys
	let name = req.body.name
	let age = req.body.age
	let nationality = req.body.nationality
	let location = req.body.location
	let description = req.body.missionDescription
	let bounty = req.body.bounty

	console.log(`server: Target name : ${name} , Mission description: ${description}`)


	let contractResult = await client.query(`INSERT INTO target_list (name, age, nationality, living_district, created_at, updated_at) 
	values ($1, $2, $3, $4, NOW(), NOW()) `, [name, age, nationality, location])
})



// for testing session, can delete in the end
app.get('/session', (req, res) => {
	res.json(req.session)
})
// app.use(chatroom)


// app.use(grantExpress as express.RequestHandler)
app.use('/user', userRoutes)
// app.use('/memos', memosRoutes)
app.get('/test-logger', (req, res) => {
	logger.error('This is error')
	logger.warn('This is warn')
	logger.info('This is info')
	logger.verbose('This is verbose')
	logger.debug('This is debug')
	res.end('ok')
})
app.use(express.static('public')) // auto to do next()

// GET /use/promotion
// app.use('/uploads', express.static('uploads')) // auto to do next()
app.use((req, res) => {
	res.redirect('/404.html')
})
setIO(io)
server.listen(8080, () => {
	// Auto create a folder
	// fs.mkdirSync(uploadDir, { recursive: true })
	console.log('Listening on http://localhost:8080')
})
