const utils = require("../api.utils")
const params = require("../api.params")

module.exports = (app, sequelize, express) => {

    app.put("/rapport/create", async (req, res) => {
        const results = await sequelize.models.Rapport.createRapport({
            note: req.body.note,
            commentaire: req.body.commentaire,
            visit_id: req.body.visit_id,
        })
        return res.status(results.status).json(results)
    })

    app.get("/rapport", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_VISITOR, params.USER_ROLE_PLANNER]), async (req, res) => {
        
        const userId = req.token.id
        const results = await sequelize.models.Rapport.getAll(userId)
        
        return res.status(results.status).json(results)
    })

    app.get("/rapport/:id", async (req, res) => {

        // query
        const rapportId = req.params.id
        
        const results = await sequelize.models.Rapport.getOne(rapportId)
        return res.status(results.status).json(results)
    })

    app.patch("/rapport/:id/update", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER, params.USER_ROLE_VISITOR]), async (req, res) => {

        // params
        const rapportId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.Rapport.updateRapport(rapportId, {
            note: req.body.note,
            commentaire: req.body.commentaire
        })
        return res.status(results.status).json(results)
    })

    app.delete("/rapport/:id/delete", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER, params.USER_ROLE_VISITOR]), async (req, res) => {
        
        // params
        const rapportId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.Rapport.deleteRapport(rapportId)
        return res.status(results.status).json(results)
    })


    return app
}