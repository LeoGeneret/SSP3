
const apiAlgo = require("../Algo/Algo")
const params = require("../api.params")
const utils = require("../api.utils")

module.exports = (app, sequelize, express) => {


    /**
     * @api {get} /planning
     * @apiName getPlanning
     * @apiGroup Planning
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {object} error
     * @apiSuccess {string} error.message La description de l'erreur
     * @apiSuccess {Number} status Le status http de la response
     * @apiSuccess {object} data
     * @apiSuccess {object[]} data.events Liste des visites
     * @apiSuccess {String} data.id Id de la visite
     * @apiSuccess {String} data.start Date et heure de debut de la visite (YYYY-MM-DDTHH:mm:ssZ)
     * @apiSuccess {String} data.title Nom de l'hotel
     * @apiSuccess {String[]} data.resourceIds Ensemble des visiteurs
     * @apiSuccess {Number} data.hotel_id Id de l'hotel
     * 
     */
    app.get("/planning", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_VISITOR, params.USER_ROLE_PLANNER]), async (req, res) => {
        // query
        const week = req.query.week || null
        const day = req.query.day || null

        const userId = req.token.id

        const results = await sequelize.models.Visite.getPlanning(week, day, userId)
        return res.status(results.status).json(results)
    })

    /**
     * @api {put} /planning/create
     * @apiName createPlanning
     * @apiGroup Planning
     * @apiVersion 1.0.0
     * 
     * @apiSuccessExample Sucesss: 
     *      HTTP/1.1 201 OK
     * @apiErrorExample Error: 
     *      HTTP/1.1 400 BAD REQUEST
     */
    app.put("/planning/create", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER]), async (req, res) => {
        // query
        const date = req.query.date || null
        const results = await apiAlgo.creerPlanning(date)

        if(results){
            return res.status(201).json("true") // in future will return nothing but 201
        } else {
            return res.status(400).json("false") // in future will return nothing but 400
        }
    })  

    return app
}