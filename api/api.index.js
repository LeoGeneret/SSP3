
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
 * MIDDLEWARES
 */

// Init cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    next()
})

/**
 * ROUTES
 */
app.get("/", async (req, res) => {
    return res.send({api_ssp3_is_runnning: true})
})

/**
 * HOTEL'S ROUTES
 */
app.get("/hotel", async (req, res) => {
    
    // query
    const offset = (req.query.offset && Number(req.query.offset)) || undefined
    const limit = (req.query.limit && Number(req.query.limit)) || undefined

    const results = await sequelize.models.Hotel.getAll(offset, limit)
    return res.status(results.status).send(results)
})

/**
 * VISITEUR'S ROUTES
 */
app.get("/visiteur", async (req, res) => {

    // query
    const offset = (req.query.offset && Number(req.query.offset)) || undefined
    const limit = (req.query.limit && Number(req.query.limit)) || undefined

    const results = await sequelize.models.Visiteur.getAll(offset, limit)
    return res.status(results.status).send(results)
})


/**
 * VOITURE'S ROUTES
 */
app.get("/voiture", async (req, res) => {
        
    // query
    const offset = (req.query.offset && Number(req.query.offset)) || undefined
    const limit = (req.query.limit && Number(req.query.limit)) || undefined

    const results = await sequelize.models.Voiture.getAll(offset, limit)
    return res.status(results.status).send(results)
})

app.delete("/voiture/:id/delete", async (req, res) => {
        
    const voitureId = (req.params.id && Number(req.params.id)) || undefined
    const results = await sequelize.models.Voiture.deleteVoiture(voitureId)
    return res.status(results.status).send(results)
})

app.put("/voiture/create", async (req, res) => {
    const results = await sequelize.models.Voiture.createVoiture({
        immatriculation: req.body.immatriculation,
        type: req.body.type,
        adresse: req.body.adresse,
        ville: req.body.ville,
        code_postal: req.body.code_postal
    })
    return res.status(results.status).send(results)
})

app.patch("/voiture/:id/update", async (req, res) => {

    // params
    const voitureId = (req.params.id && Number(req.params.id)) || undefined

    const results = await sequelize.models.Voiture.updateVoiture(voitureId, {
        immatriculation: req.body.immatriculation,
        type: req.body.type,
        adresse: req.body.adresse,
        ville: req.body.ville,
        code_postal: req.body.code_postal
    })
    return res.status(results.status).send(results)
})

/**
 * VISITE'S ROUTES
 */
app.get("/visit", async (req, res) => {

    // query
    const offset = (req.query.offset && Number(req.query.offset)) || undefined
    const limit = (req.query.limit && Number(req.query.limit)) || undefined

    const results = await sequelize.models.Visite.getAll(offset, limit)
    return res.status(results.status).send(results)
})




app.listen(PORT, () => console.log("API IS RUNNING ON PORT " + PORT))