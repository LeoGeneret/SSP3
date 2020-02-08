
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

        role: {
            type: DataTypes.ENUM("visitor", "planner"),
            allowNull: false,
        }

    }, {
        createdAt: false,
        updatedAt: false
    })


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
                attributes: ["id", "role"],
                where: {
                    email,
                    password
                }
            })
            results.data = user.get()
        } catch(AuthenticateError){
            console.log({AuthenticateError})
            results.error = {
                code: 401,
                message: "Unauthorized - email or password is invalid"
            }
            results.status = 401
        }

        return results
    }

    return User
}