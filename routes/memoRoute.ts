import express from 'express'
import { logger } from '../utils/logger'
// import jsonfile from 'jsonfile'
// import { io } from '../Utils/setIO'
import { formParse, formParseBetter } from '../utils/upload'
import { client } from '../utils/db'
import { isLoggedin } from '../utils/guard'
import formidable from 'formidable'
import fs from "fs"
import { request } from 'http'
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

		let target = await client.query(
			`select * from target_list where name = $1`, [fields.targetName]
		)
		let isMatched = target.rows[0]
		if (!isMatched) {
			res.status(400).json({ message: 'invalid target' })
			return
		} else {
			let result = await client.query(
				`INSERT INTO orders 
				(bounty, expiration, target_id, liked, created_at, updated_at, status, client_id) values 
			($1, NOW(), $2, $3, NOW(), NOW(), $4, $5) `,
				[fields.bounty, target.rows[0].id, 0, 'pending', 1]
			)
			res.json({
				message: 'Upload successful'
			})
		}
	} catch (e) {
		console.log(e)
		res.status(400).send('Upload Fail')
		return
	}
})


memosRoutes.post('/target', async (req, res) => {
		try {
		// console.log(req)
		const {
			filename: image,
			fields
		}: any = await formParseBetter(req)

		let {targetName, nationality, age, company, location, remarks} = fields

		await client.query(`
		INSERT INTO target_list 
		(name, nationality, age, company, living_district, remarks, created_at) values
		($1, $2, $3, $4, $5, $6, NOW())`, 
		[targetName, nationality, !age ? null : age, company, location, remarks])
		res.status(200).json({message: 'Upload successful'})
		return;
	} catch (e) {
		console.log(e)
		res.status(400).json({ message: 'Upload Fail'})
		return
	}
})

