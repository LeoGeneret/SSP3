const utils = require("../api.utils")
const params = require("../api.params")

module.exports = (app, sequelize, express) => {

    app.get("/signalement", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_VISITOR, params.USER_ROLE_PLANNER]), async (req, res) => {

        const results = await sequelize.models.Signalement.getAll()
        return res.status(results.status).json(results)
    })

    app.put("/signalement/create", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_VISITOR, params.USER_ROLE_PLANNER]), async (req, res) => {

        const userId = req.token.id
        
        const results = await sequelize.models.Signalement.createSignalement(
            req.body.motif,
            req.body.visit_id,
            userId,
            req.body.commentaire,
        )
        return res.status(results.status).json(results)
    })

    app.patch("/signalement/:id/notify", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER]), async (req, res) => {

        // params
        const signalementId = req.params.id

        const results = await sequelize.models.Signalement.notifySignalement(signalementId)
        return res.status(results.status).json(results)
    })

}
