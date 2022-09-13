import express from 'express'
import { userRoutes } from './routes/userRoute'
import { client } from './utils/db'
import { checkPassword, hashPassword } from './hash'
// import fs from 'fs'
// import { uploadDir } from './utils/upload'
import { logger } from './utils/logger'
// import { memosRoutes } from './routes/memoRoute'
import http from 'http'
import { Server as SocketIO } from 'socket.io'
// import { loggingUserRoute } from './utils/guard'
import { grantExpress, sessionMiddleware } from './utils/middleware'
import { setIO } from './utils/setIO'

declare module 'express-session' {
	interface SessionData {
		name?: string
		isloggedin?: boolean
	}
}

export const app = express()

app.use(express.json())


// sign up account with unique referral code, will fail if referral code doesn't exist
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
	[username, hashedPassword, 'killer'])
	res.json({ message: 'User created' })
}
)

app.post('/login', async (req, res) => {
	const username = req.body.username
	const password = req.body.password
	console.log(username, password)
	if (!username || !password){
		res.status(400).json({
			message: 'Invalid username or password'
		})
	}

	

})
const server = new http.Server(app)
export const io = new SocketIO(server)
app.use(express.urlencoded({ extended: true }))
app.use(sessionMiddleware)

// app.use(grantExpress as express.RequestHandler)
// app.use('/user', loggingUserRoute, userRoutes)
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
