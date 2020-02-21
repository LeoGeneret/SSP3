
module.exports = (app, sequelize, express) => {

    app.get("/secteur", async (req, res) => {
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