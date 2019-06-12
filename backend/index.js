const express = require('express')
const knex = require('./db/knex.js')
const app = express()
app.use(express.json())
app.get('/api', (req, res) => {
  res.send('Welcome to Mastermind-Backend')
})
app.listen(3000, () => console.log("Listening on port 3000"))

app.get('/api/score', async (req, res) =>{
    let results = await knex('score')
    res.json(results)
})

app.post('api/score', async (req, res) =>{
    let results = await knex('score')
                        .insert({name: req.body.name},
                                {tries: req.body.tries},
                                {time: req.body.time})
                                //{creation_date: req.body.creation_date})
    res.json(results)
})

app.delete('/api/score/:id', async (req, res) =>{
    let results = await knex('score')
                        .where('id', req,params.id)
                        .del()
    res.json(results)
})