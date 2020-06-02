
module.exports = (app, sequelize, express) => {

    app.get("/user/:id/info", async (req, res) => {

        // params
        const userId = req.params.id || null

        const results = await sequelize.models.User.getUserInfo(userId)

        return res.status(results.status).json(results)
    })

}
