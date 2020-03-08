
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const ApiUtils = require("../../api.utils")
const params = require("../../api.params")

module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('user', {

        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        token_reset_password: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        role: {
            type: DataTypes.ENUM(params.USER_ROLE_VISITOR, params.USER_ROLE_PLANNER),
            allowNull: false,
        }

    }, {
        createdAt: false,
        updatedAt: false
    })


    // Retrieve short user information 

    User.getUserInfo = async userId => {

        let results = {
            error: false,
            status: 200,
            data: null,
        }

        try {
            
            const user = await User.findByPk(userId, {
                attributes: ["id", "role"],
                include: [
                    {
                        association: "visiteur",
                        attributes: ["nom"]
                    }
                ]
            })

            if(user){
                results.data = {
                    role: user.get("role"),
                    nom: user.get("visiteur").get("nom"),
                }
            } else {
                results.error = {
                    message: "NOT FOUND - user not found"
                }
                results.status = 404
            }
            
        } catch (GetUserInfo) {
            console.log({GetUserInfo})
            results.error = {
                message: "BAD GETAWAY error on getting user info"
            }
            results.status = 502
        }

        return results
    }

    User.findByEmail = async email => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        // if email invalid
        if(!email){
            results.error = {
                message: "BAD REQUEST - email is empty",
                code: 400
            }
            results.status = 400
        } else {
            try {
                let user = await User.findOne({
                    attributes: ["id"],
                    where: {
                        email: email
                    }
                })
    
                // if user not found
                if(!user){
                    results.error = {
                        message: "NOT FOUND - user not found",
                        code: 404
                    }
                    results.status = 404
                } else {
                    results.data = user.get()
                }
            } catch (ErrorFindUserByEmail) {
                console.log({ErrorFindUserByEmail})
                results.error = {
                    code: 502,
                    message: "BAD GATEWAY - error on finding user by email"
                }
                results.status = 502
            }
        }

        return results
    }

    User.createTokenResetPassword = async (email, resetTokenPassword) => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        if(!resetTokenPassword){
            results.error = {
                message: "BAD REQUEST - token is empty",
                code: 400
            }
            results.status = 400
        } else {

            const findUserResults = await User.findByEmail(email)

            if(findUserResults.error){
                results = findUserResults
            } else {

                try {

                    const modifiedUser = await User.update({
                        token_reset_password: resetTokenPassword
                    }, {
                        where: {
                            id: findUserResults.data.id
                        }
                    })

                    // user has been updated
                    if(modifiedUser[0]){
                        results.data = {
                            token_reset_password: resetTokenPassword
                        }
                    }
                    
                } catch (ErrorCreatingToken) {
                    results.error = {
                        code: 502,
                        message: "BAD GATEWAY - error on creating token"
                    }
                    results.status = 502
                }
            }
        }

        return results
    }

    User.findTokenResetPassword = async tokenResetPassword => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        // if token null or empty
        if(!tokenResetPassword || (tokenResetPassword && !tokenResetPassword.length)){
            results.error = {
                message: "BAD REQUEST - token is empty",
                code: 400
            }
            results.status = 400
        } else {
            let user = null

            // find token
            try {
                user = await User.findOne({
                    attributes: ["id", "token_reset_password"],
                    where: {
                        token_reset_password: tokenResetPassword
                    }
                })

                // if token exists
                if(user){
                    const verifyTokenResults = ApiUtils.verifyToken(user.token_reset_password, process.env.EMAIL_SECRET)
                    
                    // inherit results
                    results = verifyTokenResults
                    
                    //overwrite data - we dont want to pass verified token
                    if(verifyTokenResults.data){
                        results.data = {
                            user_id: user.id
                        }
                    }
                    
                } else {
                    results.error = {
                        message: "Unauthorized - token invalid",
                        code: 401
                    }
                    results.status = 401
                }
    
            } catch (error) {
                results.error = {
                    code: 502,
                    message: "BAD GATEWAY - error on verifying token_reset_password"
                }
                results.status = 502
            }
        }

        return results
    }

    User.resetPassword = async (userId, password) => {

        let results = {
            error: false,
            status: 200,
            data: null,
        }

        try {

            const hashedPassword = await bcrypt.hash(password, 10)
            
            const modified = await User.update({
                password: hashedPassword,
                token_reset_password: null
            }, {
                where: {
                    id: userId
                }
            })

            results.data = {
                modified: modified[0]
            }

        } catch (ErrorResetPassword) {
            console.log({ErrorResetPassword})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on reseting password"
            }
            results.status = 502
        }

        return results
    }

    User.authenticate = async (email, password) => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        if(!email || !password){
            return {
                error:{
                    message: "BAD REQUEST - email or password is empty",
                    code: 400
                },
                status: 400,
                data: null,
            }
        }

        try{
            let user = await User.findOne({
                attributes: ["id", "role", "password"],
                where: {
                    email,
                }
            })

            let isSamePassword = false

            // user found > compare passwords
            if(user){
                isSamePassword = await bcrypt.compare(password, user.get("password"))
            }

            // no user matched or password incorrect
            if(!user || (user && !isSamePassword)){
                results.error = {
                    message: "Unauthorized - email or password is incorrect",
                    code: 401
                }
                results.status = 401
            } else {
                results.data = {
                    id: user.get("id"),
                    role: user.get("role"),
                }
            }
        } catch(AuthenticateError){
            console.log({AuthenticateError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on authenticating user"
            }
            results.status = 502
        }

        return results
    }

    return User
}