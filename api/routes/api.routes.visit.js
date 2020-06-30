const utils = require("../api.utils")
const params = require("../api.params")

module.exports = (app, sequelize, express) => {

    // app.get("/visite", async (req, res) => {

    //     // query
    //     // const offset = (req.query.offset && Number(req.query.offset)) || undefined
    //     // const limit = (req.query.limit && Number(req.query.limit)) || undefined

    //     const results = await sequelize.models.Visite.getAll(offset, limit)
    //     return res.status(results.status).json(results)
    // })

    // app.get("/visite", async (req, res) => {
    //     // query
    //     const date = req.query.date || null
    //     const results = await sequelize.models.Visite.getPlanning(date)
    //     return res.status(results.status).json(results)
    // })

    /**
     * @api {delete} /visite/:id/delete
     * @apiName deleteVisite
     * @apiGroup Visit
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {object} error
     * @apiSuccess {string} error.message La description de l'erreur
     * @apiSuccess {Number} status Le status http de la response
     * @apiSuccess {string} data Vaut "deleted" si la visite a été supprimé
     * 
     */
    app.delete("/visite/:id/delete", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER]), async (req, res) => {

        const visiteId = (req.params.id && Number(req.params.id)) || undefined
        const results = await sequelize.models.Visite.deleteVisite(visiteId)
        return res.status(results.status).json(results)
    })

    /**
     * @api {patch} /visite/:id/update
     * @apiName updateVisit
     * @apiGroup Visit
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {String} data.id Id de la visite
     * @apiSuccess {String} data.start Date et heure de debut de la visite (YYYY-MM-DDTHH:mm:ssZ)
     * @apiSuccess {String} data.title Nom de l'hotel
     * @apiSuccess {String[]} data.resourceIds Ensemble des visiteurs
     * 
     */
    app.patch("/visite/:id/update", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER]), async (req, res) => {

        // params
        const visiteId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.Visite.updateVisite(visiteId, {
            visited_at: req.body.visited_at,
            time_start: req.body.time_start,
            time_end: req.body.time_end,
            hotel_id: req.body.hotel_id,
            voiture_id: req.body.voiture_id,
            visiteur_id_1: req.body.visiteur_id_1,
            visiteur_id_2: req.body.visiteur_id_2,
            //@WAIT - rajouter rapport_note, rapport_comment
        })
        return res.status(results.status).json(results)
    })

    /**
     * @api {put} /visite/:id/create
     * @apiName createVisite
     * @apiGroup Visit
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {String} data.id Id de la visite
     * @apiSuccess {String} data.start Date et heure de debut de la visite (YYYY-MM-DDTHH:mm:ssZ)
     * @apiSuccess {String} data.title Nom de l'hotel
     * @apiSuccess {String[]} data.resourceIds Ensemble des visiteurs
     * 
     */
    app.put("/visite/create", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER]), async (req, res) => {
        const results = await sequelize.models.Visite.createVisite({
            visited_at: req.body.visited_at,
            time_start: req.body.time_start,
            time_end: req.body.time_end,
            hotel_id: req.body.hotel_id,
            visiteur_id_1: req.body.visiteur_id_1,
            visiteur_id_2: req.body.visiteur_id_2,
            //@WAIT - rajouter rapport_note, rapport_comment
        })
        return res.status(results.status).json(results)
    })

    return app
}