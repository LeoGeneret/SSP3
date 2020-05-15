module.exports = (app, sequelize, express) => {

    /**
     * ####################################
     * #################################### /visiteur
     * ####################################
     */
    
    /**
     * @api {get} /visiteur
     * @apiName updateVisiteur
     * @apiGroup Visiteur
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {object} error
     * @apiSuccess {string} error.message La description de l'erreur
     * @apiSuccess {Number} status Le status http de la response
     * @apiSuccess {object} data
     * @apiSuccess {object[]} visiteurs
     * @apiSuccess {Number} visiteurs.id
     * @apiSuccess {String} visiteurs.nom
     * @apiSuccess {String} visiteurs.adresse
     * @apiSuccess {String} visiteurs.ville
     * @apiSuccess {String} visiteurs.code_postal
     * @apiSuccess {Number} visiteurs.secteur_id
     * @apiSuccess {Number} visiteurs.user_id
     * @apiSuccess {object} pagination
     * @apiSuccess {Number} pagination.item_count Nombre total existant
     * @apiSuccess {Number} pagination.page_current Page actuelle
     * @apiSuccess {Number} pagination.page_count Nombre de page
     * 
     */
    app.get("/visiteur", async (req, res) => {

        // query
        const offset = (req.query.offset && Number(req.query.offset)) || undefined
        const limit = (req.query.limit && Number(req.query.limit)) || undefined
        // use a int boolean
        const attributes = req.query.attributes || undefined

        const results = await sequelize.models.Visiteur.getAll(attributes)
        return res.status(results.status).json(results)
    })

    app.get("/visiteur/:id", async (req, res) => {

        // query
        const visiteurId = req.params.id

        // use a int boolean
        const attributes = req.query.attributes || undefined

        const results = await sequelize.models.Visiteur.getOne(attributes, visiteurId)
        return res.status(results.status).json(results)
    })

    /**
     * @api {delete} /visiteur/:id/delete
     * @apiName deleteVisiteur
     * @apiGroup Visiteur
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {object} error
     * @apiSuccess {string} error.message La description de l'erreur
     * @apiSuccess {Number} status Le status http de la response
     * @apiSuccess {string} data Vaut "deleted" si le visiteur a été supprimé
     * 
     */
    app.delete("/visiteur/:id/delete", async (req, res) => {
        
        // params
        const visiteurId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.Visiteur.deleteVisiteur(visiteurId)
        return res.status(results.status).json(results)
    })

    /**
     * @api {put} /visiteur/create
     * @apiName createVisiteur
     * @apiGroup Visiteur
     * @apiVersion 1.0.0
     * 
     * @apiParam {string} nom Nom de l'hotel
     * @apiParam {string} adresse Adresse de l'hotel
     * @apiParam {string} ville Ville de l'hotel
     * @apiParam {string} code_postal Code postal de l'hotel
     * @apiParam {Number} nombre_chambre Nombre de chambre de l'hotel
     * @apiParam {Number} secteur_id Id du secteur de l'hotel
     * 
     */
    app.put("/visiteur/create", async (req, res) => {

        const results = await sequelize.models.Visiteur.createVisiteur({
            nom: req.body.nom,
            adresse: req.body.adresse,
            ville: req.body.ville,
            code_postal: req.body.code_postal,
            secteur_id: req.body.secteur_id
        })
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
    app.patch("/visiteur/:id/update", async (req, res) => {

        // params
        const visiteurId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.Visiteur.updateVisiteur(visiteurId, {
            nom: req.body.nom,
            adresse: req.body.adresse,
            ville: req.body.ville,
            code_postal: req.body.code_postal,
            secteur_id: req.body.secteur_id
        })
        return res.status(results.status).json(results)
    })

    return app
}