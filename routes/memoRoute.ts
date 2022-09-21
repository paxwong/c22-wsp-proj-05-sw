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
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript'
export const memosRoutes = express.Router()


// Create contracts

memosRoutes.post('/order', async (req, res) => {
	if (!req.session['user']) {
		res.status(401).json({
			message: 'invalid session'
		})
		return
	}
	try {
		// console.log(req)
		const {
			// files,
			fields
		}: any = await formParseBetter(req);

		// console.log('files = ', files)


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
				[parseInt(bounty), target.rows[0].id, 'pending', missionDescription, req.session['user'].id]  //added descriptions
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

memosRoutes.get('/admin-order', async (req: any, res: any) => {
	if (!req.session.user || req.session.user.account_type === 'client' || req.session.user.account_type === 'killer') {
		res.status(401).json({ message: 'Unauthorized access' })
		return
	}
	let clientResult = await client.query(`select photos.photo as photo, orders.id as id, orders.bounty as bounty, orders.description as description, orders.status as status, orders.description as description, target_list.name as name, target_list.nationality as nationality, target_list.age as age, target_list.company as company, target_list.living_district as location, target_list.remarks as remarks from orders join target_list on orders.target_id = target_list.id join photos on photos.target_id = target_list.id where status = 'pending'`)
	res.json(clientResult)
})

memosRoutes.get('/completedJobs', async (req: any, res: any) => {
	let completedCases = await client.query(`select photos.photo as photo, orders.id as id, orders.bounty as bounty, orders.description as description, orders.status as status, orders.description as description, target_list.name as name, target_list.nationality as nationality, target_list.age as age, target_list.company as company, target_list.living_district as location, target_list.remarks as remarks from orders join target_list on orders.target_id = target_list.id join photos on photos.target_id = target_list.id where status = 'completed'`)
	res.json(completedCases)
})

memosRoutes.get('/presentJobs', async (req: any, res: any) => {
	if (!req.session.user || req.session.user.account_type === 'client') {
		res.status(401).json({ message: 'Unable to retrieve' })
		return
	}

	let pendingCases = await client.query(`select photos.photo as photo, orders.id as id, orders.bounty as bounty, orders.description as description, orders.status as status, orders.description as description, target_list.name as name, target_list.nationality as nationality, target_list.age as age, target_list.company as company, target_list.living_district as location, target_list.remarks as remarks from orders join target_list on orders.target_id = target_list.id join photos on photos.target_id = target_list.id where status = 'approved'`)
	res.json(pendingCases)
})

memosRoutes.get('/targetList', async (req, res) => {
	let targetList = await client.query(`SELECT target_list.name as name, photos.photo as photo FROM target_list LEFT OUTER JOIN photos ON photos.target_id = target_list.id`)	
	res.json(targetList)
})

memosRoutes.post('/evidences', async (req, res) => {
	try {
		// console.log(req)
		const {
			files,
			fields,
			filename
		}: any = await formParseBetter(req);

		await client.query(`INSERT INTO evidence (photo, order_id, killer_id) VALUES ($1, $2, $3)`, [filename, fields.id, req.session.user.id])
		res.status(200).json({ message: 'Success' })
		// console.log('files = ', filename)
	} catch (e) {
		console.log(e)
		return
	}
})

memosRoutes.post('/evidence-decision', async (req, res) => {
	const id = req.body.id
	const status = req.body.status
	if (status === 'rejected'){
		await client.query('DELETE FROM evidence where id =$1', [id])
		res.status(200).json({message: 'removed'})
		return
	}
	if (status === 'approved'){
		let orderID = await client.query('SELECT * from evidence where id = $1', [id])
		let idInput = orderID.rows[0].order_id
		await client.query(`UPDATE orders SET status = 'completed' where id = $1`, [idInput])
		res.status(200).json({message: 'amended'})
		return
	}
	res.status(200).json({message: 'Success'})

})

memosRoutes.get('/evidences', async (req, res) => {
	if (!req.session.user || req.session.user.account_type === 'client' || req.session.user.account_type === 'killer') {
		res.status(401).json({ message: 'Unauthorized access' })
		return
	}
	let results = await client.query(`SELECT photos.photo as target_photo, evidence.id as evidence_id, evidence.photo as evidence_photo, orders.bounty as bounty, orders.status as status, orders.description as description, target_list.name as name, target_list.nationality as nationality, target_list.age as age, target_list.company as company, target_list.living_district as location, target_list.remarks as target_remarks FROM evidence JOIN orders ON evidence.order_id = orders.id JOIN target_list ON orders.target_id = target_list.id join photos on photos.target_id = target_list.id where orders.status = 'approved'`)
	res.json(results)

})

memosRoutes.get('/user-order', async (req: any, res: any) => {
	let clientResult = await client.query(`select photos.photo as photo, orders.client_id as id, orders.bounty as bounty, orders.description as description, orders.status as status, orders.description as description, target_list.name as name, target_list.nationality as nationality, target_list.age as age, target_list.company as company, target_list.living_district as location, target_list.remarks as remarks from orders join target_list on orders.target_id = target_list.id join photos on photos.target_id = target_list.id where orders.client_id = $1`, [req.session.user.id])
	res.json(clientResult)
})


//killer side looking for contracts

memosRoutes.get('/killer-order', async (req: any, res: any) => {

	let killerResult = await client.query(`select orders.id as id, orders.bounty as bounty, orders.description as description, orders.status as status, orders.description as description, target_list.name as name, target_list.nationality as nationality, target_list.age as age, target_list.company as company, target_list.living_district as location, target_list.remarks as remarks from orders join target_list on orders.target_id = target_list.id where status = 'approved'`)
	res.json(killerResult)

})

//client side looking for approve contracts
memosRoutes.get('/client-order-approved', async (req: any, res: any) => {

	let clientResult = await client.query(`select orders.client_id as id, orders.bounty as bounty, orders.description as description, orders.status as status, orders.description as description, target_list.name as name, target_list.nationality as nationality, target_list.age as age, target_list.company as company, target_list.living_district as location, target_list.remarks as remarks from orders join target_list on orders.target_id = target_list.id where status = 'approved', orders.client_id = $1`, [req.session.user.id])
	res.json(clientResult)

})

//client side looking for pending contracts
memosRoutes.get('/client-order-pending', async (req: any, res: any) => {

	let clientResult = await client.query(`select orders.client_id as id, orders.bounty as bounty, orders.description as description, orders.status as status, orders.description as description, target_list.name as name, target_list.nationality as nationality, target_list.age as age, target_list.company as company, target_list.living_district as location, target_list.remarks as remarks from orders join target_list on orders.target_id = target_list.id where status = 'pending',orders.client_id = $1`, [req.session.user.id])
	res.json(clientResult)

})

//client side looking for decline contracts
memosRoutes.get('/client-order-declined', async (req: any, res: any) => {

	let clientResult = await client.query(`select orders.client_id as id, orders.bounty as bounty, orders.description as description, orders.status as status, orders.description as description, target_list.name as name, target_list.nationality as nationality, target_list.age as age, target_list.company as company, target_list.living_district as location, target_list.remarks as remarks from orders join target_list on orders.target_id = target_list.id where status = 'declined', orders.client_id = $1`, [req.session.user.id])
	res.json(clientResult)

})

memosRoutes.post('/target', async (req, res) => {
	try {
		// console.log(req)
		const {
			filename,
			files,
			fields
		}: any = await formParseBetter(req)

		let { targetName, nationality, age, company, location, remarks } = fields
		await client.query(`
		INSERT INTO target_list
		(name, nationality, age, company, living_district, remarks, created_at) values
		($1, $2, $3, $4, $5, $6, NOW())`,
		[targetName, nationality, !age ? null : age, company, location, remarks])

		let id = await client.query(`select id from target_list ORDER BY id DESC LIMIT 1`)
		// console.log(`ID IS`, id.rows[0])
		// let idInput = id.rows[0] * 1

		

		await client.query(`
		INSERT INTO photos
		(target_id, photo) values 
		($1, $2)`,
		[id.rows[0].id,filename])
		
		res.status(200).json({ message: 'Upload successful' })
		return;
	} catch (e) {
		console.log(e)
		res.status(400).json({ message: 'Upload Fail' })
		return
	}
})





