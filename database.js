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
    where policy_number like ?`, ['%' + policyNumber + '%'])
    return rows
}

export const getAgents = async (id) => {
    const [rows] = await pool.query(`select * from agent`)
    return rows
}

const test = await getPoliciesByPolicyNumber('mk')
console.log(test)