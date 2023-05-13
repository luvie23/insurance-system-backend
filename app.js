import express from "express";
import cors from 'cors'

import { getPoliciesByAgent, getAgents } from "./database.js";

const app = express();
app.use(cors({
    origin: '*'
}));
app.use(express.json());


app.get('/policies/agent_id/:id', async (req, res) => {
    const id = req.params.id;
    const policies = await getPoliciesByAgent(id)
    res.send(policies)
})

app.get('/agents', async (req, res) => {
    const agents = await getAgents()
    res.send(agents)
})


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})