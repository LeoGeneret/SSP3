const apiAlgo = require("../Algo/Algo")

module.exports = (app, sequelize, express) => {

    /**
     * @api {get} /hotel
     * @apiName getHotel
     * @apiGroup Hotel
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {object} error
     * @apiSuccess {string} error.message La description de l'erreur
     * @apiSuccess {Number} status Le status http de la response
     * @apiSuccess {object[]} data Liste des hotels ordonnée grâce à l'algorithme
     * @apiSuccess {Number} data.id Id de l'hotel
     * @apiSuccess {String} data.nom Nom de l'hotel
     * @apiSuccess {String} data.code_postal Code postal de l'hotel
     * @apiSuccess {Boolean} data.priority Vaut true si l'hotel a été mis urgent par le planificateur
     * @apiSuccess {object} data.secteur Secteur de l'hotel
     * @apiSuccess {Number} data.secteur.id Id du secteur
     * @apiSuccess {String} data.secteur.label Intitulé du secteur (ex: "77")
     * @apiSuccess {String} data.ville Ville de l'hotel
     * @apiSuccess {String} data.adresse Adresse complete de l'hotel
     * @apiSuccess {Number} data.nombre_chambre Nombre de chambre dans l'hotel
     * @apiSuccess {String} data.last_visited_at Derniere date de visite de l'hotel
     * @apiSuccess {Number} data.last_note Dernier note de l'hotel
     * 
     */

    app.get("/hotel", async (req, res) => {
        const results = await apiAlgo.getHotelFormated()
        return res.status(results.status).json(results)
    })  

    /**
     * @api {delete} /hotel/:id/delete
     * @apiName deleteHotel
     * @apiGroup Hotel
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {object} error
     * @apiSuccess {string} error.message La description de l'erreur
     * @apiSuccess {Number} status Le status http de la response
     * @apiSuccess {string} data Vaut "deleted" si l'hotel a été supprimé
     * 
     */

    app.delete("/hotel/:id/delete", async (req, res) => {
        
        const hotelId = (req.params.id && Number(req.params.id)) || undefined
        const results = await sequelize.models.Hotel.deleteHotel(hotelId)
        return res.status(results.status).json(results)
    })

    /**
     * @api {delete} /hotel/create
     * @apiName createHotel
     * @apiGroup Hotel
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
    app.put("/hotel/create", async (req, res) => {
        const results = await sequelize.models.Hotel.createHotel({
            nom: req.body.nom,
            adresse: req.body.adresse,
            code_postal: req.body.code_postal,
            ville: req.body.ville,
            nombre_chambre: req.body.nombre_chambre,
            secteur_id: req.body.secteur_id
        })
        return res.status(results.status).json(results)
    })

    /**
     * @api {patch} /hotel/:id/update
     * @apiName updateHotel
     * @apiGroup Hotel
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
    app.patch("/hotel/:id/update", async (req, res) => {

        // params
        const hotelId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.Hotel.updateHotel(hotelId, {
            nom: req.body.nom,
            adresse: req.body.adresse,
            code_postal: req.body.code_postal,
            ville: req.body.ville,
            nombre_chambre: req.body.nombre_chambre,
            secteur_id: req.body.secteur_id,
            priority: req.body.priority,
        })
        return res.status(results.status).json(results)
    })

return app
}