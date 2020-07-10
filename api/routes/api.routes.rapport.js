const utils = require("../api.utils")
const params = require("../api.params")
const multer = require('../middleware/multerconfig')

module.exports = (app, sequelize, express) => {

    /**
     * @api {put} /rapport/:id/create
     * @apiName createRapport
     * @apiGroup Rapport
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {String} data.id Id du Rapport
     * @apiSuccess {String} data.note Note de l'hotel
     * @apiSuccess {String} data.commentaire Commentaire dans le rapport
     * 
     */
    app.put("/rapport/create", async (req, res) => {
        const results = await sequelize.models.Rapport.createRapport({
            note: req.body.note,
            commentaire: req.body.commentaire
        })
        return res.status(results.status).json(results)
    })

    /**
     * @api {get} /rapport
     * @apiName getAll
     * @apiGroup Rapport
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {object} error
     * @apiSuccess {string} error.message La description de l'erreur
     * @apiSuccess {Number} status Le status http de la response
     * @apiSuccess {object} data
     * @apiSuccess {object[]} data.events Liste des rapports
     * @apiSuccess {String} data.id Id du rapport
     * @apiSuccess {String} data.note Note de l'hotel dans le rapport
     * @apiSuccess {String} data.commentaire Commentaire sur l'hotel dans le rapport
     * @apiSuccess {String[]} data.images Images dans le rapport 
     * 
     */
    app.get("/rapport", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_VISITOR, params.USER_ROLE_PLANNER]), async (req, res) => {
        const attributes = req.query.attributes || undefined
        const userId = req.token.id
        
        const results = await sequelize.models.Rapport.getAll(attributes, userId)
        
        return res.status(results.status).json(results)
    })

    /**
     * @api {get} /rapport/:id
     * @apiName getOne
     * @apiGroup Rapport
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {object} error
     * @apiSuccess {string} error.message La description de l'erreur
     * @apiSuccess {Number} status Le status http de la response
     * @apiSuccess {object} data
     * @apiSuccess {String} data.id Id du rapport
     * @apiSuccess {String} data.note Note de l'hotel dans le rapport
     * @apiSuccess {String} data.commentaire Commentaire sur l'hotel dans le rapport
     * @apiSuccess {String[]} data.images Images dans le rapport 
     * 
     */
    app.get("/rapport/:id", async (req, res) => {

        // query
        const rapportId = req.params.id
        
        const results = await sequelize.models.Rapport.getOne(rapportId)
        return res.status(results.status).json(results)
    })

    /**
     * @api {patch} /rapport/:id/update
     * @apiName updateRapport
     * @apiGroup Rapport
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {String} data.id Id du rapport
     * @apiSuccess {String} data.note Note de l'hotel
     * @apiSuccess {String} data.commentaire Commentaire dans le rapport
     * 
     */
    app.patch("/rapport/:id/update", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER, params.USER_ROLE_VISITOR]), async (req, res) => {

        // params
        const rapportId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.Rapport.updateRapport(rapportId, {
            note: req.body.note,
            commentaire: req.body.commentaire
        })
        return res.status(results.status).json(results)
    })

    /**
     * @api {delete} /rapport/:id/delete
     * @apiName deleteRapport
     * @apiGroup Rapport
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {object} error
     * @apiSuccess {string} error.message La description de l'erreur
     * @apiSuccess {Number} status Le status http de la response
     * @apiSuccess {string} data Vaut "deleted" si le rapport a été supprimé
     * 
     */
    app.delete("/rapport/:id/delete", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER, params.USER_ROLE_VISITOR]), async (req, res) => {
        
        // params
        const rapportId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.Rapport.deleteRapport(rapportId)
        return res.status(results.status).json(results)
    })

    /**
     * @api {post} /rapport/:id/image
     * @apiName createRapportImage
     * @apiGroup RapportImage
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {String} data.id Id du RapportImage
     * @apiSuccess {String} data.src Lien de l'image
     * 
     */
    app.post("/rapport/:id/image", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER, params.USER_ROLE_VISITOR]), multer, async (req, res) => {
        const results = await sequelize.models.RapportImage.createRapportImage({
            src: `${process.env.MEDIA_STORAGE_HOST}/images/${req.file.filename}`,
            rapport_id: req.body.rapport_id
        })
        return res.status(results.status).json(results)
    })


    return app
}