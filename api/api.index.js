
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


app.listen(PORT, () => console.log("API IS RUNNING ON PORT " + PORT))