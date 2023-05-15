import express from "express";
import cors from 'cors'

import { getPoliciesByAgent, getAgents, getPoliciesByPolicyNumber, getPoliciesByChassisNumber, getPoliciesByEngineNumber, getPoliciesByPlateNumber } from "./database.js";

const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());


app.get('/policies/agent_id=:id', async (req, res) => {
    const id = req.params.id;
    const policies = await getPoliciesByAgent(id)
    res.send(policies)
})

app.get('/agents', async (req, res) => {
    const agents = await getAgents()
    res.send(agents)
})

app.get('/policies/policy_number=:policyNumber', async (req, res) => {
    const policyNumber = req.params.policyNumber;
    const policies = await getPoliciesByPolicyNumber(policyNumber)
    res.send(policies)
})

app.get('/policies/chassis_number=:chassisNumber', async (req, res) => {
    const chassisNumber = req.params.chassisNumber;
    const policies = await getPoliciesByChassisNumber(chassisNumber)
    res.send(policies)
})

app.get('/policies/engine_number=:engineNumber', async (req, res) => {
    const engineNumber = req.params.engineNumber;
    const policies = await getPoliciesByEngineNumber(engineNumber)
    res.send(policies)
})

app.get('/policies/plate_number=:plateNumber', async (req, res) => {
    const plateNumber = req.params.plateNumber;
    const policies = await getPoliciesByPlateNumber(plateNumber)
    res.send(policies)
})


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})