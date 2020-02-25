const params = require("../api.params")
const utils = require("../api.utils")

module.exports = (app, sequelize, express) => {

    app.get("/secteur", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_VISITOR, params.USER_ROLE_PLANNER]), async (req, res) => {
        const results = await sequelize.models.Secteur.getAll()
        return res.status(results.status).json(results)
    })

    app.put("/secteur/create", async (req, res) => {
        const results = await sequelize.models.Secteur.createSecteur({
            label: req.body.label,
        })
        return res.status(results.status).json(results)
    })
    
    return app
}