const jwt = require("jsonwebtoken")
const xss = require("xss")

// duration in seconds
const TOKEN_EXPIRY = 60 * 60 * 24

module.exports = (app, sequelize, express) => {

    const checkToken = async (req, res, next) => {

        let results = {
            error: false,
            status: 200,
            data: null,
        }

        let token = req.header("Authorization") && req.header("Authorization").replace("Bearer ", "")
        let verifiedToken = null
        
        // if token parsed
        if(token && token.length){
            jwt.verify(token, process.env.API_SECRET, (err, decoded) => {

                if(err){
                    return;
                }

                verifiedToken = decoded
            })
        } else {
            results.error = {
                code: 400,
                message: "BAD REQUEST - token not found in Authorization: Bearer <token>"
            }
            results.status = 400
        }

        // if token invalid
        if(!verifiedToken){
            results.error = {
                code: 401,
                message: "Unauthorized - token is invalid or has expired"
            }
            results.status = 401
        }

        if(results.error){
            return res.status(results.status).send(results)
        } else {
            req.token = verifiedToken
            return next()
        }
    }

    const checkUserRole = (roles = []) => async (req, res, next) => {

        let results = {
            error: false,
            status: 200,
            data: null,
        }

        if(req.token){
            if(!roles.includes(req.token.role)){
                results.error = {
                    code: 403,
                    message: "FORBIDDEN - Access denied for role {" + req.token.role + "}"
                }
                results.status = 403
            }
        } else {
            results.error = {
                code: 401,
                message: "Unauthorized - token is invalid or has expired"
            }
            results.status = 401
        }

        if(results.error){
            return res.status(results.status).send(results)
        } else {
            return next()
        }
    }
    
    app.get("/", async (req, res) => {
        return res.send({api_ssp3_is_runnning: true})
    })

    app.get("/check_token", checkToken, checkUserRole(["planner", "visitor"]), async (req, res) => {
        res.send(req.token)
    })

    app.post("/authenticate", async (req, res) => {
    
        const email = req.body.email && xss(req.body.email) || null
        const password = req.body.password && xss(req.body.password) || null

        const results = await sequelize.models.User.authenticate(email, password)

        // user is authenticated -> create token
        if(results.data){

            const token = jwt.sign({
                id: results.data.id,
                role: results.data.role,
            }, process.env.API_SECRET, {
                expiresIn: TOKEN_EXPIRY
            })

            return res.send({
                ...results,
                data: {
                    token: token
                }
            })
            
        } 

        return res.status(results.status).send(results)
    })

    /**
     * ####################################
     * #################################### /hotel
     * ####################################
     */
    app.get("/hotel", async (req, res) => {
        
        // query
        const offset = (req.query.offset && Number(req.query.offset)) || undefined
        const limit = (req.query.limit && Number(req.query.limit)) || undefined

        const results = await sequelize.models.Hotel.getAll(offset, limit)
        return res.status(results.status).send(results)
    })

    app.delete("/hotel/:id/delete", async (req, res) => {
        
        const hotelId = (req.params.id && Number(req.params.id)) || undefined
        const results = await sequelize.models.Hotel.deleteHotel(hotelId)
        return res.status(results.status).send(results)
    })

    app.put("/hotel/create", async (req, res) => {
        const results = await sequelize.models.Hotel.createHotel({
            nom: req.body.nom,
            adresse: req.body.adresse,
            code_postal: req.body.code_postal,
            ville: req.body.ville,
            nombre_chambre: req.body.nombre_chambre,
            secteur_id: req.body.secteur_id
        })
        return res.status(results.status).send(results)
    })

    app.patch("/hotel/:id/update", async (req, res) => {

        // params
        const hotelId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.Hotel.updateHotel(hotelId, {
            nom: req.body.nom,
            adresse: req.body.adresse,
            code_postal: req.body.code_postal,
            ville: req.body.ville,
            nombre_chambre: req.body.nombre_chambre,
            secteur_id: req.body.secteur_id
        })
        return res.status(results.status).send(results)
    })

    /**
     * ####################################
     * #################################### /visiteur
     * ####################################
     */
    app.get("/visiteur", async (req, res) => {

        // query
        const offset = (req.query.offset && Number(req.query.offset)) || undefined
        const limit = (req.query.limit && Number(req.query.limit)) || undefined

        const results = await sequelize.models.Visiteur.getAll(offset, limit)
        return res.status(results.status).send(results)
    })

    app.delete("/visiteur/:id/delete", async (req, res) => {
        
        // params
        const visiteurId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.Visiteur.deleteVisiteur(visiteurId)
        return res.status(results.status).send(results)
    })

    app.put("/visiteur/create", async (req, res) => {
        const results = await sequelize.models.Visiteur.createVisiteur({
            nom: req.body.nom,
            adresse: req.body.adresse,
            ville: req.body.ville,
            code_postal: req.body.code_postal,
            secteur_id: req.body.secteur_id
        })
        return res.status(results.status).send(results)
    })

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
        return res.status(results.status).send(results)
    })


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
        return res.status(results.status).send(results)
    })

    app.delete("/voiture/:id/delete", async (req, res) => {
            
        const voitureId = (req.params.id && Number(req.params.id)) || undefined
        const results = await sequelize.models.Voiture.deleteVoiture(voitureId)

        return res.status(results.status).send(results)
    })

    app.put("/voiture/create", async (req, res) => {
        const results = await sequelize.models.Voiture.createVoiture({
            immatriculation: req.body.immatriculation,
            type: req.body.type,
            adresse: req.body.adresse,
            ville: req.body.ville,
            code_postal: req.body.code_postal
        })
        return res.status(results.status).send(results)
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
        return res.status(results.status).send(results)
    })

    /**
     * ####################################
     * #################################### /visite
     * ####################################
     */
    app.get("/visite", async (req, res) => {

        // query
        const offset = (req.query.offset && Number(req.query.offset)) || undefined
        const limit = (req.query.limit && Number(req.query.limit)) || undefined

        const results = await sequelize.models.Visite.getAll(offset, limit)
        return res.status(results.status).send(results)
    })

    app.delete("/visite/:id/delete", async (req, res) => {

        const visiteId = (req.params.id && Number(req.params.id)) || undefined
        const results = await sequelize.models.Visite.deleteVisite(visiteId)
        return res.status(results.status).send(results)
    })

    app.patch("/visite/:id/update", async (req, res) => {

        // params
        const visiteId = (req.params.id && Number(req.params.id)) || undefined

        const results = await sequelize.models.Visite.updateVisite(visiteId, {
            visited_at: req.body.visited_at,
            time_start: req.body.time_start,
            time_end: req.body.time_end,
            hotel_id: req.body.hotel_id,
            voiture_id: req.body.voiture_id,
            binome_id: req.body.binome_id,
            //@WAIT - rajouter rapport_note, rapport_comment
        })
        return res.status(results.status).send(results)
    })

    app.put("/visite/create", async (req, res) => {
        const results = await sequelize.models.Visite.createVisite({
            visited_at: req.body.visited_at,
            time_start: req.body.time_start,
            time_end: req.body.time_end,
            hotel_id: req.body.hotel_id,
            voiture_id: req.body.voiture_id,
            binome_id: req.body.binome_id,
            //@WAIT - rajouter rapport_note, rapport_comment
        })
        return res.status(results.status).send(results)
    })

        /**
     * ####################################
     * #################################### /secteur
     * ####################################
     */
    app.get("/secteur", async (req, res) => {
        const results = await sequelize.models.Secteur.getAll()
        return res.status(results.status).send(results)
    })

    app.put("/secteur/create", async (req, res) => {
        const results = await sequelize.models.Secteur.createSecteur({
            label: req.body.label,
        })
        return res.status(results.status).send(results)
    })

    return app
}