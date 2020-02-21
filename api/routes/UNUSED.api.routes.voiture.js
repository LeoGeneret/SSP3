
module.exports = (app, sequelize, express) => {

    /**
     * ####################################
     * #################################### /voiture
     * ####################################
     */
    app.get("/voiture", async (req, res) => {
            
        // query
        const offset = (req.query.offset && Number(req.query.offset)) || undefined
        const limit = (req.query.limit && Number(req.query.limit)) || undefined

        const results = await sequelize.models.Voiture.getAll(offset, limit)
        return res.status(results.status).json(results)
    })

    app.delete("/voiture/:id/delete", async (req, res) => {
            
        const voitureId = (req.params.id && Number(req.params.id)) || undefined
        const results = await sequelize.models.Voiture.deleteVoiture(voitureId)

        return res.status(results.status).json(results)
    })

    app.put("/voiture/create", async (req, res) => {
        const results = await sequelize.models.Voiture.createVoiture({
            immatriculation: req.body.immatriculation,
            type: req.body.type,
            adresse: req.body.adresse,
            ville: req.body.ville,
            code_postal: req.body.code_postal
        })
        return res.status(results.status).json(results)
    })

    app.patch("/voiture/:id/update", async (req, res) => {

        // params
        const voitureId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.Voiture.updateVoiture(voitureId, {
            immatriculation: req.body.immatriculation,
            type: req.body.type,
            adresse: req.body.adresse,
            ville: req.body.ville,
            code_postal: req.body.code_postal
        })
        return res.status(results.status).json(results)
    })

    return app
}