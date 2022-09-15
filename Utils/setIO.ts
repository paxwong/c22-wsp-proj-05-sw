import { Server as SocketIO } from 'socket.io'
import express from 'express'
import { sessionMiddleware } from './middleware'

import { server } from '../app'
export let io : SocketIO

export function setIO(value : SocketIO) {
	io = value

	io.on('connection', function (socket) {
		const req = socket.request as express.Request;
		console.log('new socket connected: ', socket.id)
		console.log('session: ', req.session )

		if (req.session && req.session.user){
			console.log('joining socket room :', req.session!.user!['username'])
			socket.join(req.session!.user!['username'])
		
		}

		// 如果無login ， 就連socket 都無得用
		// if (!socket.request['session'].user) {
		// 	socket.disconnect()
		// }


		//add chatroom .on logic here

	})
}
