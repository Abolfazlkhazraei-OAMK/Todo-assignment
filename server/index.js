require('dotenv').config()
console.log(process.env)
const express = require('express');
const cors =  require('cors');
//const { Pool } = require('pg');
const { query } = require('./helpers/db.js')

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

const port = process.env.PORT || 3001;

app.get('/', async (req, res) => {
    console.log(query)
    try {
        const result = await query('select * from task')
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

app.post('/new',  async (req,res)=>{
    try {
        const result = await query('insert into task (description) values ($1) returning *',
        [req.body.description])
        res.status(200).json({id:result.rows[0].id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

app.delete("/delete/:id",async(req,res)=> {
    const id = Number(req.params.id)
    try {
        const result = await query('delete from task where id = $1',
        [id]);
        res.status(200).json({id:id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})


app.listen(port)