
// Fetch env variables
require("dotenv").config()

/**
 * CORES
 */
const express = require("express")
const app = express()

const sequelize = require("./database/database.index")


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


app.get("/visit", async (req, res) => {

    // query
    const offset = (req.query.offset && Number(req.query.offset)) || undefined
    const limit = (req.query.limit && Number(req.query.limit)) || undefined

    console.log(sequelize.models.Visite.associations)

    const results = await sequelize.models.Visite.getAll(offset, limit)
    return res.send(results)
})


app.listen(PORT, () => console.log("API IS RUNNING ON PORT " + PORT))