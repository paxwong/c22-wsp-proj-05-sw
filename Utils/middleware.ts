import { env } from './env'
import expressSession from 'express-session'
import grant from 'grant'

export let sessionMiddleware = expressSession({
	secret: env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true
})
export const grantExpress = grant.express({
	defaults: {
		origin: 'http://localhost:8080',
		transport: 'session',
		state: true
	}
	// },
	// google: {
	// 	key: env.GOOGLE_CLIENT_ID,
	// 	secret: env.GOOGLE_CLIENT_SECRET,
	// 	scope: ['profile', 'email'],
	// 	callback: '/user/login/google'
	// }
})
