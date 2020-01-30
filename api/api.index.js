
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
 * ####################################
 * #################################### /visite
 * ####################################
 */
app.get("/visite", async (req, res) => {

    // query
    const offset = (req.query.offset && Number(req.query.offset)) || undefined
    const limit = (req.query.limit && Number(req.query.limit)) || undefined

    const results = await sequelize.models.Visite.getAll(offset, limit)
    return res.status(results.status).send(results)
})

app.delete("/visite/:id/delete", async (req, res) => {

    const visiteId = (req.params.id && Number(req.params.id)) || undefined
    const results = await sequelize.models.Visite.deleteVisite(visiteId)
    return res.status(results.status).send(results)
})

app.patch("/visite/:id/update", async (req, res) => {

    // params
    const visiteId = (req.params.id && Number(req.params.id)) || undefined

    const results = await sequelize.models.Visite.updateVisite(visiteId, {
        visited_at: req.body.visited_at,
        time_start: req.body.time_start,
        time_end: req.body.time_end,
        hotel_id: req.body.hotel_id,
        voiture_id: req.body.voiture_id,
        binome_id: req.body.binome_id,
        //@WAIT - rajouter rapport_note, rapport_comment
    })
    return res.status(results.status).send(results)
})

app.put("/visite/create", async (req, res) => {
    const results = await sequelize.models.Visite.createVisite({
        visited_at: req.body.visited_at,
        time_start: req.body.time_start,
        time_end: req.body.time_end,
        hotel_id: req.body.hotel_id,
        voiture_id: req.body.voiture_id,
        binome_id: req.body.binome_id,
        //@WAIT - rajouter rapport_note, rapport_comment
    })
    return res.status(results.status).send(results)
})

app.listen(PORT, () => console.log("API IS RUNNING ON PORT " + PORT))

// 200 OK — This is most commonly used HTTP code to show that the operation performed is successful.
// 201 CREATED — This can be used when you use POST method to create a new resource.
// 202 ACCEPTED — This can be used to acknowledge the request sent to the server.
// 400 BAD REQUEST — This can be used when client side input validation fails.
// 401 UNAUTHORIZED / 403 FORBIDDEN— This can be used if the user or the system is not authorised to perform certain operation.
// 404 NOT FOUND— This can be used if you are looking for certain resource and it is not available in the system.
// 500 INTERNAL SERVER ERROR — This should never be thrown explicitly but might occur if the system fails.
// 502 BAD GATEWAY — This can be used if server received an invalid response from the upstream server.