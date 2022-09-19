import express from 'express'
import { logger } from '../utils/logger'
// import jsonfile from 'jsonfile'
import { io } from '../Utils/setIO'
import { formParse, formParseBetter } from '../utils/upload'
import { client } from '../utils/db'
import { isLoggedin } from '../utils/guard'
import formidable from 'formidable'
import fs from "fs"
import { request } from 'http'
export const memosRoutes = express.Router()


// Create contracts

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

// client personal contracts (pending, aprroved)

memosRoutes.get('/clients-order', async (req: any, res: any) => {
	console.log("test")
	let clientResult = await client.query(`select * from orders where status = 'pending'`)
	res.json(clientResult)

})