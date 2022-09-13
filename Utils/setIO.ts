import { Server as SocketIO } from 'socket.io'
import express from 'express'
import { sessionMiddleware } from './middleware'
let io: SocketIO
export function setIO(value: SocketIO) {
	io = value
	io.use((socket, next) => {
		let req = socket.request as express.Request
		let res = req.res!
		sessionMiddleware(req, res, next as express.NextFunction)
	})
	io.on('connection', function (socket) {
		console.log('new socket connected: ', socket.id)

		// 如果無login ， 就連socket 都無得用
		// if (!socket.request['session'].user) {
		// 	socket.disconnect()
		// }


		//add chatroom .emit .on logic here

	})
}
