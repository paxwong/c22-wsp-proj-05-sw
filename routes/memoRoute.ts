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
				(bounty, expiration, target_id, liked, created_at, updated_at, status, description, client_id) values 
			($1, NOW(), $2, $3, NOW(), NOW(), $4, $5, $6) `,
				[fields.bounty, target.rows[0].id, 0, 'pending', fields.missionDescription, req.session.id]
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

<<<<<<< HEAD
// client personal contracts (pending, aprroved)

memosRoutes.get('/clients-order', async (req: any, res: any) => {
	console.log("test")
	let clientResult = await client.query(`select * from orders where status = 'pending'`)
	res.json(clientResult)

})
=======

memosRoutes.post('/target', async (req, res) => {
	try {
		// console.log(req)
		const {
			filename: image,
			fields
		}: any = await formParseBetter(req)

		let { targetName, nationality, age, company, location, remarks } = fields

		await client.query(`
		INSERT INTO target_list
		(name, nationality, age, company, living_district, remarks, created_at) values
		($1, $2, $3, $4, $5, $6, NOW())`,
			[targetName, nationality, !age ? null : age, company, location, remarks])
		res.status(200).json({ message: 'Upload successful' })
		return;
	} catch (e) {
		console.log(e)
		res.status(400).json({ message: 'Upload Fail' })
		return
	}
})

>>>>>>> e6ce736bf94f8bb5f7a55421f42425d3c6930033
