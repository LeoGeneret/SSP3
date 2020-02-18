/** CORES */
const jwt = require("jsonwebtoken")
const xss = require("xss")

let crypto
try {
  crypto = require('crypto')
} catch (err) {
  console.log('crypto support is disabled!', err);
}

/** UTILS */
const mailer = require("./email/email")
const ApiUtils = require("./api.utils")


/** CONSTANTS */

// duration in seconds
const TOKEN_ACCESS_EXPIRY = 60 * 60 * 24
const TOKEN_RESET_PASSWORD_EXPIRY = 60 * 60 * 24

module.exports = (app, sequelize, express) => {

    const checkToken = async (req, res, next) => {

        let results = {
            error: false,
            status: 200,
            data: null,
        }

        let token = req.header("x-access-token")
        let verifiedToken = null
        
        if(token){

            const verifyTokenResults = ApiUtils.verifyToken(token, process.env.API_SECRET)
            
            if(verifyTokenResults.data){
                verifiedToken = verifyTokenResults.data
            } else {
                results = verifyTokenResults
            }
            
        } else {
            results.error = {
                code: 400,
                message: "BAD REQUEST - token not found in header"
            }
            results.status = 400
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
        return res.send({api_ssp3_is_runnning: req.hostname})
    })


    app.get("/send-email", async (req, res) => {

        await mailer.send("zkeny@outlook.fr", "Test envoei avec SES", __dirname + "/email/templates/reset-password.html")
            .then(mail => {
                res.json(mail)
            })
    })

    /**
     * ####################################
     * #################################### /auth
     * ####################################
     */
    app.post("/auth/forgot_password", async (req, res) => {

        let results = {
            error: false,
            status: 200,
            data: null,
        }

        // body
        const email = req.body.email && xss(req.body.email) || null


        /** Creating token reset password */
        let resetTokenValue = null

        try {
            resetTokenValue = jwt.sign({

            }, process.env.EMAIL_SECRET, {
                expiresIn: TOKEN_RESET_PASSWORD_EXPIRY
            })
        } catch (error) {
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on generating reset token"
            }
            results.status = 502
        }

        if(resetTokenValue){

            results = await sequelize.models.User.createTokenResetPassword(email, resetTokenValue)

            if(results.data){
                // not waiting for mail to be sent
                mailer.send(
                    "zkeny@outlook.fr",
                    "[TEMP] SSP3 - Reset your password",
                    __dirname + "/email/templates/reset-password.html",
                    {
                        "@name": "John Doe",
                        "@title": "Reset your password",
                        "@token": results.data.token_reset_password
                    }
                ).then(createdMail => {
                    console.log("Email has been sent")
                })
                .catch(errorSendingMail => {
                    console.log("Error while sending email", errorSendingMail)
                })

                // we dont want to send the user id as response
                results.data = null
            }
        }

        return res.status(results.status).send(results)
    })

    app.post("/auth/signin", async (req, res) => {
    
        const email = req.body.email && xss(req.body.email) || null
        const password = req.body.password && xss(req.body.password) || null

        const results = await sequelize.models.User.authenticate(email, password)

        // user is authenticated -> create token
        if(results.data){

            const token = jwt.sign({
                id: results.data.id,
                role: results.data.role,
            }, process.env.API_SECRET, {
                expiresIn: TOKEN_ACCESS_EXPIRY
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
    
    app.post("/auth/reset", async (req, res) => {

        let results = {
            error: false,
            status: 200,
            data: null,
        }

        // params
        const password = (req.body.password && xss(req.body.password)) || null
        const token = (req.body.token && xss(req.body.token)) || null

        
        const findTokenResults = await sequelize.models.User.findTokenResetPassword(token)

        if(findTokenResults.error){
            results = findTokenResults
        } else {
            results = await sequelize.models.User.resetPassword(findTokenResults.data.user_id, password)
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
        // use a int boolean
        const noLimit = (req.query.no_limit && Number(req.query.no_limit)) || undefined
        const attributes = req.query.attributes || undefined

        const results = await sequelize.models.Visiteur.getAll(offset, limit, attributes, noLimit)
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
     * #################################### /planning
     * ####################################
     */
    app.get("/planning", async (req, res) => {

        // query
        const date = req.query.date || null

        const results = await sequelize.models.Visite.getPlanning(date)
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