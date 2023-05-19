import mysql from 'mysql2';
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
}).promise()



const result = await pool.query('select * from policy left join agent on policy.agent_id = agent.id where agent.id = 6')

export const getPoliciesByAgent = async (id) => {
    const [rows] = await pool.query(`select * from policy 
    left join agent on policy.agent_id = agent.id 
    left join assured on policy.assured_id = assured.id
    where agent.id = ?`, [id])
    return rows
}

export const getPoliciesByPolicyNumber = async (policyNumber) => {
    const [rows] = await pool.query(`select * from policy 
    left join agent on policy.agent_id = agent.id 
    left join assured on policy.assured_id = assured.id
    where policy_number like ?`, ['%' + policyNumber + '%'])
    return rows
}

export const getPoliciesByEngineNumber = async (engineNumber) => {
    const [rows] = await pool.query(`select * from policy 
    left join agent on policy.agent_id = agent.id 
    left join assured on policy.assured_id = assured.id
    where engine_number like ?`, ['%' + engineNumber + '%'])
    return rows
}

export const getPoliciesByChassisNumber = async (chassisNumber) => {
    const [rows] = await pool.query(`select * from policy 
    left join agent on policy.agent_id = agent.id 
    left join assured on policy.assured_id = assured.id
    where chassis_number like ?`, ['%' + chassisNumber + '%'])
    return rows
}

export const getPoliciesByPlateNumber = async (plateNumber) => {
    const [rows] = await pool.query(`select * from policy 
    left join agent on policy.agent_id = agent.id 
    left join assured on policy.assured_id = assured.id
    where plate_number like ?`, ['%' + plateNumber + '%'])
    return rows
}

export const getPoliciesByAssuredName = async (assuredName) => {
    const [rows] = await pool.query(`select * from policy 
    left join agent on policy.agent_id = agent.id 
    left join assured on policy.assured_id = assured.id
    where assured.first_name like ? or assured.last_name like?`, ['%' + assuredName + '%', '%' + assuredName + '%'])
    return rows
}

export const getAgents = async (id) => {
    const [rows] = await pool.query(`select * from agent`)
    return rows
}

export const getPolicyByPolicyNumber = async (policyNumber) => {
    const [rows] = await pool.query(`select *, concat(agent.first_name, ' ', agent.last_name) as agent_name from policy 
    left join agent on policy.agent_id = agent.id 
    left join assured on policy.assured_id = assured.id
    where policy_number = ?`, [policyNumber])
    return rows
}

export const getNotesByPolicyNumber = async (policyNumber) => {
    const [rows] = await pool.query(`select content, title, notes.created_at from notes
    left join policy on notes.policy_id = policy.id
    where policy_number = ?
    order by notes.created_at desc`, [policyNumber])
    return rows
}

const createAssured = async (first_name, last_name, address, contact_number, dateTime) => {
    const [assuredResult] = await pool.query(`
    insert into assured (first_name, last_name, address, contact_number, created_at, updated_at)
    values (?, ?, ?, ?, ?, ?)
    `, [first_name, last_name, address, contact_number, dateTime, dateTime])
    return assuredResult.insertId

}

export const createPolicy = async (request) => {
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date+' '+time;
    
    const assuredId = await createAssured(request.first_name, request.last_name, request.address, request.contact_number, dateTime)
    console.log(assuredId)
    const [policy] = await pool.query(`
    insert into policy (agent_id, assured_id, policy_number, bill_number, plate_number, engine_number, chassis_number, issue_date, inception_date, expiry_date, own_damage, acts_of_nature, bi_pd, auto_passenger, acts_of_nature_premium, own_damage_premium, auto_passenger_premium, bi_premium, pd_premium, gross_premium, taxes, total_premium, paid_premium, balance, created_at, updated_at)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `, [request.agent_id, assuredId, request.policy_number, request.bill_number, request.plate_number, request.engine_number, request.chassis_number, request.issue_date, request.inception_date, request.expiry_date, request.own_damage, request.acts_of_nature, request.bi_pd, request.auto_passenger, request.acts_of_nature_premium, request.own_damage_premium, request.auto_passenger_premium, request.bi_premium, request.pd_premium, request.gross_premium, request.taxes, request.total_premium, request.paid_premium, request.balance, dateTime, dateTime])

    return policy.insertId
}


    // firstName, 
    // lastName, 
    // address, 
    // contactNumber,
    // agentId, 
    // policyNumber, 
    // billNumber, 
    // plateNumber, 
    // engineNumber, 
    // chassisNumber, 
    // issueDate, 
    // inceptionDate, 
    // expiryDate, 
    // ownDamage, 
    // actsOfNature, 
    // bipd, 
    // autoPassenger, 
    // actsOfNaturePremium, 
    // ownDamagePremium, 
    // autoPassengerPremium, 
    // biPremium, 
    // pdPremium, 
    // grossPremium, 
    // taxes, 
    // totalPremium, 
    // paidPremium, 
    // balance