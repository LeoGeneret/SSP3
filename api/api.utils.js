const jwt = require("jsonwebtoken")

module.exports = {
    verifyToken: (token, secret) => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        try {
            results.data = jwt.verify(token, secret)
        } catch (error) {
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
    }
}