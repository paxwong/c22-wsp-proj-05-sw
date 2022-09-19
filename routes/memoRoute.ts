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
	if (!req.session.user) {
		res.status(401).json({
			message: 'invalid session'
		})
		return
	}
	try {
		// console.log(req)
		const {
			filename: image,
			fields
		}: any = await formParseBetter(req)

		let { targetName, bounty, missionDescription } = fields


		let target = await client.query(
			`select * from target_list where name = $1`, [targetName]
		)
		let isMatched = target.rows[0]
		if (!isMatched) {
			res.status(400).json({ message: 'invalid target' })
			return
		} else {
			let result = await client.query(
				`INSERT INTO orders 
				(bounty, target_id, created_at, status, description, client_id) values 
			($1, $2, NOW(), $3, $4, $5) `,
				[parseInt(bounty), target.rows[0].id, 'pending', missionDescription, req.session.user.id]  //added descriptions
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

// 
// client personal contracts (pending, aprroved)

memosRoutes.get('/clients-order', async (req: any, res: any) => {
	console.log("test")
	let clientResult = await client.query(`select orders.id as id, orders.bounty as bounty, orders.description as description, orders.status as status, orders.description as description, target_list.name as name, target_list.nationality as nationality, target_list.age as age, target_list.company as company, target_list.living_district as location, target_list.remarks as remarks from orders join target_list on orders.target_id = target_list.id where status = 'pending'`)
	res.json(clientResult)

})
// =======

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





