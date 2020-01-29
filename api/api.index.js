
// Fetch env variables
require("dotenv").config()

/**
 * CORES
 */
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const sequelize = require("./database/database.index")

app.use(express.json())


/**
 * CONSTANTS
 */
const PORT = 3002

/**
 * ROUTES
 */
app.get("/", async (req, res) => {
    return res.send({api_ssp3_is_runnning: true})
})

app.get("/hotel", async (req, res) => {
    
    // query
    const offset = (req.query.offset && Number(req.query.offset)) || undefined
    const limit = (req.query.limit && Number(req.query.limit)) || undefined

    const results = await sequelize.models.Hotel.getAll(offset, limit)
    return res.send(results)
})

app.get("/visiteur", async (req, res) => {

    // query
    const offset = (req.query.offset && Number(req.query.offset)) || undefined
    const limit = (req.query.limit && Number(req.query.limit)) || undefined

    const results = await sequelize.models.Visiteur.getAll(offset, limit)
    return res.send(results)
})

app.get("/voiture", async (req, res) => {
        
    // query
    const offset = (req.query.offset && Number(req.query.offset)) || undefined
    const limit = (req.query.limit && Number(req.query.limit)) || undefined

    const results = await sequelize.models.Voiture.getAll(offset, limit)
    return res.send(results)
})

/*app.get("/hotel", async (req, res) => {
    const hotels = await sequelize.models.Hotel.getAll()
    return res.send(hotels)
})*/

// REFAIRE
// app.get("/hotel", async (req, res) => {

//     const hotels = await sequelize.models.Voiture.getAll()

//     return res.send(hotels)
// })


app.post('/hotels/:id/create', async (req, res) => {
    console.log(req.body)
    return res.send({foo:req.params.id})
    
})


app.listen(PORT, () => console.log("API IS RUNNING ON PORT " + PORT))