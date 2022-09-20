import express, { Request, Response } from 'express'
import { io } from '../Utils/setIO'

import { client } from '../utils/db'
import { checkPassword, hashPassword } from '../utils/hash'
import { logger } from '../utils/logger'
export const userRoutes = express.Router()
userRoutes.get('/me', getMe)
// userRoutes.get('/login/google', loginGoogle)
userRoutes.post('/register', register)
userRoutes.get('/', getAllUsers)
// userRoutes.get('/liked-memo/:userId', getLikedMemoByUserId)
userRoutes.post('/login', login)
userRoutes.get('/logout', logout)
// async function getLikedMemoByUserId(req: Request, res: Response) {
// 	let userId = req.params.userId

// 	if (!Number(userId)) {
// 		res.status(400).json({
// 			message: 'Invalid user id'
// 		})
// 		return
// 	}

// 	let result = await client.query(
// 		`
// 	select 
// 	memos.id,
// 	memos.content,
// 	memos.image,
// 	memos.created_at,
// 	memos.updated_at
// 	from likes inner join memos on memos.id = likes.memo_id
// 	where likes.user_id = $1
// `,
// 		[userId]
// 	)

// 	res.json({
// 		message: 'Success',
// 		data: {
// 			memos: result.rows,
// 			memoCount: result.rows.length
// 		}
// 	})
// }
async function login(req: Request, res: Response) {
	console.log('userRoutes - [/login]')
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		res.status(400).json({
			message: 'Invalid username or password'
		})
		return
	}

	let userResult = await client.query(
		`select * from users where username = $1`,
		[username]
	)
	let dbUser = userResult.rows[0]

	if (!dbUser) {
		res.status(400).json({
			message: 'Invalid username or password'
		})
		return
	}

	// compare password

	let isMatched = await checkPassword(password, dbUser.password)

	if (!isMatched) {
		res.status(400).json({
			message: 'Invalid username or password'
		})
		return
	}

	let {
		password: dbUserPassword,
		id,
		created_at,
		updated_at,
		...sessionUser
	} = dbUser
	console.log(sessionUser)
	req.session['user'] = sessionUser

	// res.status(200).json({
	// 	message: 'Success login'
	// })
	res.redirect('/homepage.html')
}

function logout(req: Request, res: Response) {
	req.session.destroy(() => {
		console.log('user logged out')
	})
	res.redirect('/index.html')
}

async function getMe(req: express.Request, res: express.Response) {
	res.json({
		message: 'Success retrieve user',
		data: {
			user: req.session ? req.session : null
		}
	})
}
// async function loginGoogle(req: express.Request, res: express.Response) {
// 	try {
// 		// 如果google in 成功，就會拎到 一個 access token
// 		// access token 係用黎換番google 既 user profile
// 		const accessToken = req.session?.['grant'].response.access_token

// 		// fetch google API, 拎 user profile
// 		const fetchRes = await fetch(
// 			'https://www.googleapis.com/oauth2/v2/userinfo',
// 			{
// 				method: 'get',
// 				headers: {
// 					Authorization: `Bearer ${accessToken}`
// 				}
// 			}
// 		)
// 		const googleProfile = await fetchRes.json()
// 		logger.info(googleProfile)

// 		// check 下 db有無呢個user存在
// 		const users = (
// 			await client.query(`SELECT * FROM users WHERE username = $1`, [
// 				googleProfile.email
// 			])
// 		).rows
// 		let user = users[0]

// 		// 如果 user 不存在，馬上 create 一個
// 		if (!user) {
// 			//get a random 32 bit string
// 			const randomString = crypto.randomBytes(32).toString('hex')
// 			let hashedPassword = await hashPassword(randomString)
// 			// Create the user when the user does not exist
// 			user = (
// 				await client.query(
// 					`INSERT INTO users (username,password)
// 	            VALUES ($1,$2) RETURNING *`,
// 					[googleProfile.email, hashedPassword]
// 				)
// 			).rows[0]
// 		}

// 		// 最後當佢 login 成功處理
// 		// set google profile 入去 req session
// 		if (req.session) {
// 			req.session['user'] = googleProfile
// 		}
// 		res.redirect('/')
// 	} catch (error) {
// 		console.log(error)
// 		res.redirect('/index.html?error=google login fail')
// 	}
// }

async function register(req: Request, res: Response) {
	try {
		const username = req.body.username
		const password = req.body.password

		if (!username || !password) {
			res.status(400).json({
				message: 'Invalid username or password'
			})
			return
		}

		let hashedPasword = await hashPassword(password)
		await client.query(
			`insert into users (username, password) values ($1, $2)`,
			[username, hashedPasword]
		)
		res.json({ message: 'User created' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Internal server error' })
	}
}

async function getAllUsers(req: Request, res: Response) {
	console.log('check pg client = ', client)
	// query of undefined
	let userResult = await client.query('select * from users')
	logger.debug(JSON.stringify(userResult.rows, null, 4))
	res.json(userResult.rows)
}

userRoutes.post('/speak/:username', async(req, res)=>{
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

//add chatroom .emit logic here
userRoutes.post("/admin/chat", async(req, res)=>{
	const message = req.body.message
	// console.log('req session username',req.session?.user?.username)
	let channel = req.session?.user?.username
	// console.log(message);
	
	if (!channel){
		res.status(400).json({
			message:"Login to chat"
		})
	}
	if (channel){
	io.emit('private_msg', `${channel}: ${message}`)
	// io.to(channel).emit('private_msg', `${channel}: ${message}`)
	res.json({channel})
	return
	}
})