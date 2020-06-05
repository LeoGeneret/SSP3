
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
    res.header("Access-Control-Allow-Headers", "Content-Type, x-access-token, Origin, X-Requested-With, Accept, Authorization")
    next()
})

/**
 * ROUTES
 */

 app.get("/", async (req, res) => res.json({api_running: req.hostname, api_doc: req.hostname + "/apidoc"}))

const routesHotel = require("./routes/api.routes.hotel")(app, sequelize, express)
const routesAuth = require("./routes/api.routes.auth")(app, sequelize, express)
const routesPlanning = require("./routes/api.routes.planning")(app, sequelize, express)
const routesSecteur = require("./routes/api.routes.secteur")(app, sequelize, express)
const routesVisit = require("./routes/api.routes.visit")(app, sequelize, express)
const routesVisiteur = require("./routes/api.routes.visiteur")(app, sequelize, express)
const routesUser = require("./routes/api.routes.user")(app, sequelize, express)
const routesRapport = require("./routes/api.routes.rapport")(app, sequelize, express)

// const routesVoiture = require("./routes/api.routes.voiture")(app, sequelize, express) - Unused for the moment

app.use("/apidoc", express.static("apidoc"))


app.listen(PORT, () => console.log("## API IS RUNNING ON PORT " + PORT))

// 200 OK — This is most commonly used HTTP code to show that the operation performed is successful.
// 201 CREATED — This can be used when you use POST method to create a new resource.
// 202 ACCEPTED — This can be used to acknowledge the request sent to the server.
// 400 BAD REQUEST — This can be used when client side input validation fails.
// 401 UNAUTHORIZED / 403 FORBIDDEN— This can be used if the user or the system is not authorised to perform certain operation.
// 404 NOT FOUND— This can be used if you are looking for certain resource and it is not available in the system.
// 500 INTERNAL SERVER ERROR — This should never be thrown explicitly but might occur if the system fails.
// 502 BAD GATEWAY — This can be used if server received an invalid response from the upstream server.