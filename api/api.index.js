
// Fetch env variables
require("dotenv").config()

/**
 * CORES
 */
const express = require("express")
const app = express()

/**
 * Utils
 */
const sequelize = require("./database/database.index")


/**
 * CONSTANTS
 */
const PORT = 3002

// Parse req.body
app.use(express.json())

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

const apiRoutes = require("./api.routes")(app, sequelize, express)
const apiAlgo = require("./Algo/Visites")

app.get("/algotest", async (req, res) => {

    var varTest = await apiAlgo.prioriteSelonDerniereVisite()
    return res.json(varTest)
})



app.listen(PORT, () => console.log("## API IS RUNNING ON PORT " + PORT))

// 200 OK — This is most commonly used HTTP code to show that the operation performed is successful.
// 201 CREATED — This can be used when you use POST method to create a new resource.
// 202 ACCEPTED — This can be used to acknowledge the request sent to the server.
// 400 BAD REQUEST — This can be used when client side input validation fails.
// 401 UNAUTHORIZED / 403 FORBIDDEN— This can be used if the user or the system is not authorised to perform certain operation.
// 404 NOT FOUND— This can be used if you are looking for certain resource and it is not available in the system.
// 500 INTERNAL SERVER ERROR — This should never be thrown explicitly but might occur if the system fails.
// 502 BAD GATEWAY — This can be used if server received an invalid response from the upstream server.