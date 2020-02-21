
const params = require("../api.params")
const jwt = require("jsonwebtoken")
const xss = require("xss")

module.exports = (app, sequelize, express) => {


    /**
     * @api {post} /auth/forgot_password
     * @apiName forgotPassword
     * @apiGroup Auth
     * @apiVersion 1.0.0
     * 
     * @apiParam {String} email
     * 
     * 
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
                expiresIn: params.TOKEN_RESET_PASSWORD_EXPIRY
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

        return res.status(results.status).json(results)
    })

    /**
     * @api {post} /auth/forgot_password
     * @apiName forgotPassword
     * @apiGroup Auth
     * @apiVersion 1.0.0
     * 
     * @apiParam {String} email
     * @apiParam {String} password
     */
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
                expiresIn: params.TOKEN_ACCESS_EXPIRY
            })

            return res.send({
                ...results,
                data: {
                    token: token
                }
            })
            
        } 

        return res.status(results.status).json(results)
    })
    
    /**
     * @api {post} /auth/forgot_password
     * @apiName forgotPassword
     * @apiGroup Auth
     * @apiVersion 1.0.0
     * 
     * @apiParam {String} newPassword
     * @apiParam {String} token_reset
     */
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
        
        return res.status(results.status).json(results)

    })

    return app
}