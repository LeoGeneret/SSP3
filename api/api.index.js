
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

app.get("/hotel", async (req, res) => {
    const hotels = await sequelize.models.Hotel.getAll()
    return res.send(hotels)
})

app.get("/visiteur", async (req, res) => {
    const visiteurs = await sequelize.models.Visiteur.getAll()
    return res.send(visiteurs)
})

app.get("/voiture", async (req, res) => {
    const voitures = await sequelize.models.Voiture.getAll()
    return res.send(voitures)
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




app.listen(PORT, () => console.log("API IS RUNNING ON PORT " + PORT))