const utils = require("../api.utils")
const params = require("../api.params")
const multer = require('../middleware/multerconfig');

module.exports = (app, sequelize, express) => {

    /**
     * @api {get} /rapportImage
     * @apiName getAll
     * @apiGroup RapportImage
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {object} error
     * @apiSuccess {string} error.message La description de l'erreur
     * @apiSuccess {Number} status Le status http de la response
     * @apiSuccess {object} data
     * @apiSuccess {object[]} data.events Liste des images
     * @apiSuccess {String} data.id Id de l'image
     * @apiSuccess {String} data.rapport_id Id du rapport lié à l'image
     * @apiSuccess {String} data.src Lien de l'image
     * 
     */
    app.get("/rapportImage", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_VISITOR, params.USER_ROLE_PLANNER]), async (req, res) => {
        const attributes = req.query.attributes || undefined
        const rapport_id = req.query.rapport_id || null

        const results = await sequelize.models.RapportImage.getAll(attributes, rapport_id)
        
        return res.status(results.status).json(results)
    })

    // app.post("/rapportImage/create", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER, params.USER_ROLE_VISITOR]), multer, async (req, res) => {
    //     const results = await sequelize.models.RapportImage.createRapportImage({
    //         src: `${process.env.MEDIA_STORAGE_HOST}/images/${req.file.filename}`,
    //         rapport_id: req.body.rapport_id
    //     })
    //     return res.status(results.status).json(results)
    // })

    /**
     * @api {patch} /rapportImage/:id/update
     * @apiName updateRapportImage
     * @apiGroup RapportImage
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {String} data.id Id du rapport
     * @apiSuccess {String} data.rapport_id Id du rapport lié à l'image
     * @apiSuccess {String} data.src Lien de l'image
     * 
     */
    app.patch("/rapportImage/:id/update", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER, params.USER_ROLE_VISITOR]), multer, async (req, res) => {

        // params
        const rapportImageId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.RapportImage.updateRapportImage(rapportImageId, {
            src: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            rapport_id: req.body.rapport_id
        })
        return res.status(results.status).json(results)
    })

    /**
     * @api {delete} /rapportImage/:id/delete
     * @apiName deleteRapportImage
     * @apiGroup RapportImage
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {object} error
     * @apiSuccess {string} error.message La description de l'erreur
     * @apiSuccess {Number} status Le status http de la response
     * @apiSuccess {string} data Vaut "deleted" si le rapport a été supprimé
     * 
     */
    app.delete("/rapportImage/:id/delete", utils.routes.checkToken, utils.routes.checkUserRole([params.USER_ROLE_PLANNER, params.USER_ROLE_VISITOR]), async (req, res) => {
        
        // params
        const rapportImageId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.RapportImage.deleteRapportImage(rapportImageId)
        return res.status(results.status).json(results)
    })

    return app
}