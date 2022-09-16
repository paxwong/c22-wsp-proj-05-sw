import express from 'express'
import { logger } from '../utils/logger'
// import jsonfile from 'jsonfile'
import { io } from '../Utils/setIO'
import { formParse, formParseBetter } from '../utils/upload'
import { client } from '../utils/db'
import { isLoggedin } from '../utils/guard'
import formidable from 'formidable'
import fs from "fs"
export const memosRoutes = express.Router()

// memosRoutes.get('/like-count/:memoId', async (req, res) => {
// 	let memoId = req.params.memoId
// 	if (!Number(memoId)) {
// 		res.status(400).json({
// 			message: 'Success',
// 			data: {
// 				likeCount: 10
// 			}
// 		})
// 		return
// 	}

// let result = await client.query(
// 	`
// select count(*) from memos inner join  likes on memos.id = likes.memo_id
// where memos.id = $1`,
// 	[memoId]
// )

// let result = await client.query(
// /*sql*/ `
// 				// 	select 
// 				// 	username,
// 				// 	users.id as userId 
// 				// from likes inner join users on users.id = likes.memo_id
// 				// where likes.id = $1;
// 				// `,
// 		[memoId]
// 	)

// 	res.json({
// 		message: 'Success',
// 		data: {
// 			users: result.rows,
// 			likeCount: result.rows.length
// 		}
// 	})
// })
// memosRoutes.get('/like/counter', async (req, res) => {
// 	// const memos = await jsonfile.readFile(path.join(__dirname, '../memos.json'))
// 	res.status(200).json({
// 		counter: 0
// 	})
// })

// memosRoutes.post('/like', isLoggedin, async (req, res) => {
// 	try {
// 		res.status(200).json({})
// 		return
// 	} catch (err: any) {
// 		logger.error(err)
// 		res.status(400).send(err.message)
// 		return
// 	}
// })

// memosRoutes.put('/', async (req, res) => {
// 	try {
// 		const content = req.body.text
// 		const index = req.body.index

// 		if (!index || !Number(index)) {
// 			res.status(400).json({
// 				message: 'index is invalid'
// 			})
// 			return
// 		}

// 		logger.debug('content : ' + content)
// 		logger.debug('index : ' + index)

// 		await client.query(`update memos set content = $1 where id = $2`, [
// 			content,
// 			Number(index)
// 		])
// 		res.json({
// 			message: 'success'
// 		})
// 		return
// 	} catch (err: any) {
// 		console.log(err.message)
// 		logger.error(err.message)

// 		res.status(400).send('Update error: ' + err.message)
// 		return
// 	}
// })

// memosRoutes.delete('/', isLoggedin, async (req, res) => {
// 	try {
// 		const index = req.body.index

// 		if (!index || !Number(index)) {
// 			res.status(400).json({
// 				message: 'index is invalid'
// 			})
// 			return
// 		}
// 		await client.query('delete from memos where id = $1', [Number(index)])
// 		res.json({
// 			message: 'del success'
// 		})
// 	} catch (e) {
// 		console.log('error : ' + e)
// 		res.status(500).json({
// 			message: 'del fail'
// 		})
// 	}
// })

// memosRoutes.get('/', async (req, res) => {
// 	// const memos = await jsonfile.readFile(path.join(__dirname, '../memos.json'))
// 	const memoResult = await client.query(
// 		'SELECT * from memos ORDER BY created_at desc'
// 	)
// 	// console.log(memoResult)
// 	res.json(memoResult.rows)
// 	return
// })

memosRoutes.post('/order', async (req, res) => {
	try {
		// console.log(req)
		const {
			filename: image,
			fields
		}: any = await formParseBetter(req)
		console.log("name", fields.targetName)
		console.log("form submission", image, fields)

		let result = await client.query(
			`INSERT INTO orders (bounty, expiration, target_id, liked, created_at, updated_at, status, client_id) values 
			($1, NOW(), $2, $3, NOW(), NOW(), $4, $5) `,
			[fields.bounty, fields.targetName, 0, 'pending', 1]
		)
		res.json({
			message: 'Upload successful'
		})
	} catch (e) {
		console.log(e)
		res.status(400).send('Upload Fail')
		return
	}
})

