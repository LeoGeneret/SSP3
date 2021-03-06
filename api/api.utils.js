const jwt = require("jsonwebtoken")

const Utils = {

    isNullOrUndefined: obj => obj === null || typeof obj === "undefined",

    filterPop: (array, filter) => {

        let filtered = []
        let rest = []

        for(let i = 0; i < array.length; i++){

            if(filter(array[i]) === true){
                filtered.push(array[i])
            } else {
                rest.push(array[i])
            }

        }

        return {filtered, rest}

    },

    verifyToken: (token, secret) => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        try {
            results.data = jwt.verify(token, secret)
        } catch (error) {
            console.log("verifyToken", error)
            results.error = {
                code: 401,
                message: "Unauthorized - token is invalid or has expired"
            }
            results.status = 401
        }

        return results
    },

    signToken: async (payload = {}, secret, expireIn) => {
        //
    },


    routes: {
        checkToken: async (req, res, next) => {

            let results = {
                error: false,
                status: 200,
                data: null,
            }
    
            let token = req.header("x-access-token")
            let verifiedToken = null
            
            if(token){
    
                const verifyTokenResults = Utils.verifyToken(token, process.env.API_SECRET)
                
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
                return res.status(results.status).json(results)
            } else {
                req.token = verifiedToken
                return next()
            }
        },
    
        checkUserRole: (roles = []) => async (req, res, next) => {
    
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
                console.log("checkUserRole", error)
                results.error = {
                    code: 401,
                    message: "Unauthorized - token is invalid or has expired"
                }
                results.status = 401
            }
    
            if(results.error){
                return res.status(results.status).json(results)
            } else {
                return next()
            }
        },
    }
}
module.exports = Utils