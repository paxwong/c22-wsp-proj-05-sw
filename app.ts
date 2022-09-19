import express from 'express'
import { userRoutes } from './routes/userRoute'
import expressSession from 'express-session'
import { client } from './utils/db'
import { checkPassword, hashPassword } from './hash'
import fs from 'fs'
import formidable from 'formidable'
// import { uploadDir } from './utils/upload'
import { logger } from './utils/logger'
import { memosRoutes } from './routes/memoRoute'
import http, { request } from 'http'
import { Server as SocketIO } from 'socket.io'
import { setIO } from './Utils/setIO'
// import { loggingUserRoute } from './utils/guard'
// import {chatroom} from './utils/chatroom';

export const app = express()
export const server = new http.Server(app)
export const io = new SocketIO(server)


// import { io } from './Utils/setIO'
app.use(express.json())

let sessionMiddleware = expressSession({
	secret: 'kill kill kill kill kill kill kill kill kill kill kill kill kill kill kill kill kill kill',
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false }
})

declare module 'express-session' {
	interface SessionData {
		name?: string
		isloggedIn?: boolean
		user: any
		id: number
	}
}

app.use(sessionMiddleware)
io.use((socket, next) => {
	let req = socket.request as express.Request
	let res = req.res as express.Response
	sessionMiddleware(req, res, next as express.NextFunction
	)
});

// SIGN UP account with unique referral code, will fail if referral code doesn't exist
app.post('/signup/killer', async (req, res) => {
	const username = req.body.username
	const password = req.body.password
	const referral = req.body.referral

	if (!username || !password || !referral) {
		res.status(400).json({
			message: 'Missing information'
		})
		return
	}

	let result = await client.query(`SELECT * FROM referral WHERE code = $1`, [referral])
	let isReferred = result.rows[0]
	if (!isReferred) {
		res.status(400).json({
			message: 'Invalid Referral Code'
		})
		return
	}

	let hashedPassword = await hashPassword(password)
	await client.query(`INSERT INTO users (username, password, created_at, account_type) values ($1, $2, NOW(), $3)`,
		[username, hashedPassword, 'killer'])
	res.json({ message: 'Killer account created' })
}
)

app.post('/signup/client', async (req, res) => {
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		res.status(400).json({
			message: 'Missing information'
		})
		return
	}

	let hashedPassword = await hashPassword(password)
	await client.query(`INSERT INTO users (username, password, created_at, account_type) values ($1, $2, NOW(), $3)`,
		[username, hashedPassword, 'client'])
	res.json({ message: 'Client account created' })
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
	// console.log("dbUser: ", dbUser)
	let { password: _, ...filteredUser } = dbUser
	// console.log("filteredUser: ", filteredUser)
	// console.log("_: ", _)
	// console.log("password: ", password)
	// console.log("dbUser: ", dbUser)


	req.session['user'] = filteredUser
	req.session.save()
	res.status(200).json({
		message: 'Login successfully'
	})
})

app.delete('/logout', async function (req, res) {
	req.session['user'] = ''
	res.status(200).json({
		message: 'Logout successfully'
	})
})

app.post('/counter', async (req, res) => {
	// console.log(req.body.counter) // 1
	// let counter = req.body.counter
	let result = await client.query(`UPDATE kill_count SET count = count + 1 WHERE ID = 1
		`)
	res.status(200).send('Success')
})

app.get('/counter', async (req, res) => {
	let result = await client.query(`SELECT * from kill_count`)
	let counter = result.rows[0]
	let number = 0
	if (counter) {
		number = counter.count
	}
	if (!counter) {
	await client.query(`INSERT INTO kill_count (count) VALUES (0)`)
}
	res.json(number)
})

app.post('/decision', async (req, res) => {
	const id = req.body.id
	const status = req.body.status
	await client.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id])
	res.status(200).json({message: 'Success'})
})

app.post('/userinfo', async (req, res) => {
	if (!req.session.user) {
		res.status(400).json({
			message: 'invalid session'
		})
		return
	}
	if (req.session.user.id) {
		res.status(200).json({
			message: 'redirecting'
		})
		return
	}
})

app.get('/userinformation', async (req, res) => {
		if (!req.session.user) {
		res.status(400).json({
			message: 'invalid session'
		})
		return
	}
	let id = req.session.user.id
	let result = await client.query('SELECT * from users WHERE id = $1', [id])
	let data = result.rows[0]
	res.json(data)
})
//formidable
const uploadDir = 'uploads'
const form = formidable({
	uploadDir,
	keepExtensions: true,
	maxFiles: 1,
	maxFileSize: 20000 * 1024 ** 2,
	filter: part => part.mimetype?.startsWith('image/') || false,
})

// app.post('/order', async (req, res) => {

// 	console.log(req.body);

// 	let targetName = req.body.targetName
// 	let age = req.body.age
// 	let nationality = req.body.nationality
// 	let location = req.body.location
// 	let description = req.body.missionDescription
// 	let bounty = req.body.bounty



// console.log(`server: Target name : ${name} , Mission description: ${description}`)


// let contractResult = await client.query(`
// INSERT INTO target_list (name, age, nationality, living_district, created_at, updated_at) 
// values ($1, $2, $3, $4, NOW(), NOW()) `,
// 	[targetName, age, nationality, location])

// res.end('test end')

// const formParse = (req: express.Request) => {
// 	return new Promise<any>((resolve, reject) => {
// 		// req.body => fields :36
// 		form.parse(req, (err, fields, files: Files) => {
// 			if (err) {
// 				console.log('err in form parsing', err)
// 				reject(err)
// 			}
// 			try {
// 				const text = fields.text
// 				const fromSocketId = fields.fromSocketId
// 				let file = Array.isArray(files.image)
// 					? files.image[0]
// 					: files.image
// 				console.log(file)
// 				const filename = file ? file.newFilename : null

// 				console.log({
// 					filename,
// 					text
// 				})
// 				// Get File Name
// 				resolve({
// 					filename,
// 					text,
// 					fromSocketId
// 				})
// 			} catch (error) {
// 				console.log('error in form parsing', error)
// 				reject(error)
// 			}
// 		})
// 	})
// }

// })

// POST Contracts

// app.post('/order', async (req, res) => {
// refer to create.js, req.body." " = ContractObject's keys
// 	let name = req.body.name
// 	let age = req.body.age
// 	let nationality = req.body.nationality
// 	let location = req.body.location
// 	let description = req.body.missionDescription
// 	let bounty = req.body.bounty

// 	console.log(`server: Target name : ${name} , Mission description: ${description}`)


// 	let contractResult = await client.query(`INSERT INTO target_list (name, age, nationality, living_district, created_at, updated_at) 
// 	values ($1, $2, $3, $4, NOW(), NOW()) `, [name, age, nationality, location])
// })

// fetch the data from contracts

app.get('/order', async (req, res) => {
	let missionResult = await client.query(`SELECT * from target_list`)
	res.json(missionResult.rows)
})

// for testing session, can delete in the end
app.get('/session', (req, res) => {
	res.json(req.session)
})
// app.use(chatroom)


// app.use(grantExpress as express.RequestHandler)
app.use('/user', userRoutes)

app.use((req, res, next) => {
	console.log('be4', req.method, req.path)
	next();
})
app.use('/memos', memosRoutes)




app.use((req, res, next) => {
	console.log('after', req.method, req.path)
	next();
})
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
