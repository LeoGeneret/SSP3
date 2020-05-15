
// const bcrypt = require("bcrypt")

module.exports = (sequelize, DataTypes) => {

    const Visiteur = sequelize.define('visiteur', {

        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        adresse: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        ville: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        code_postal: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    }, {
        createdAt: false,
        updatedAt: false
    })


    Visiteur.getAll = async (attributes = undefined, visiteurId = null) => {
        
        let results = {
            error: false,
            status: 200,
            data: null
        }

        if(attributes){
            attributes = attributes.split(",")
        }

        let visiteurs = null

        try {
            visiteurs = await Visiteur.findAll(Object.assign({
                attributes: attributes,
            }, visiteurId && ({
                where: {
                    id: visiteurId
                }
            })))

            if(visiteurs){

                results.data = {}
                results.data.visiteurs = visiteurs
            }

        } catch (GetAllVisiteurError) {
            console.error({GetAllVisiteurError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on fetching visiteurs",
                extra_message: attributes ? ("you specified attributes=" + attributes.toString()) : undefined
            }
            results.status = 502
        }

        return results
    }

    Visiteur.getOne = async (attributes = undefined, visiteurId = null) => {

        let results = await Visiteur.getAll(attributes, visiteurId)

        if(results.data.visiteurs && results.data.visiteurs.length){
            results.data = results.data.visiteurs[0]
        } else {
            results.data = null
        }

        return results
    }

    Visiteur.deleteVisiteur = async (visiteurId = null) => {
        
        if(visiteurId === null) {
            return {
                error:{
                    message: "BAD REQUEST - you must specify visiteurId",
                    code: 400
                },
                data: null,
                status: 400
            }
        }

        let results = {
            error: false,
            status: 200,
            data: null
        }

        let visiteur = null

        try {
            visiteur = await Visiteur.destroy({
                where: {
                    id: visiteurId
                }
            })
            if(visiteur === 0){
                results.error = {
                    code: 404,
                    message: "NOT FOUND - no visiteur found"
                }
                results.status = 404
            } else {
                results.status = 202
                results.data = "deleted"
            }
        } catch (DeleteVisiteurError) {
            console.error({DeleteVisiteurError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on deleting ressource"
            }
            results.status = 502
        }

        return results
    }

    Visiteur.createVisiteur = async (fields) => {
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let visiteur = null

        if(Object.values(fields).some(fieldsItem => fieldsItem === undefined || fieldsItem === null || fieldsItem === "")){
            results.error = {
                code: 400,
                message: "BAD REQUEST - one param is null" + JSON.stringify(fields)
            }
            results.status = 400
        } else {
            try {


                // TODO - Must create a user related
                // const hashedPassword = await bcrypt.hash("1234", 10)

                visiteur = await Visiteur.create({
                    ...fields,
                    // user: {
                    //     email: "createdininterface@email.fr",
                    //     password: hashedPassword,
                    //     role: "visitor"
                    // }
                })
    
                if(visiteur){
                    results.data = visiteur
                    results.status = 201
                }
            } catch (CreateVisiteurError) {
                console.error({CreateVisiteurError})
                results.error = {
                    code: 502,
                    message: "BAD GATEWAY - error on creating ressource"
                }
                results.status = 502
            }
        }
        return results
    }

    Visiteur.updateVisiteur = async (visiteurId, visiteurInfo) => {
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let visiteur = null
        let nextVisiteur = {...visiteurInfo}
                
        // Remove undifined keys
        Object.keys(nextVisiteur).forEach(key => (nextVisiteur[key] === null || nextVisiteur[key] === "" || nextVisiteur[key] === undefined) && delete nextVisiteur[key])
        
        try {
            [visiteurModifiedCount,] = await Visiteur.update(nextVisiteur, {
                where: {
                    id: visiteurId
                }
            })

            if(visiteurModifiedCount === 1){
                results.data = await Visiteur.findByPk(visiteurId)
            } else {
                results.error = {
                    code: 404,
                    message: "NOT FOUND - no visiteur found"
                }
                results.status = 404
            }
        } catch (UpdateVisiteurError) {
            console.error({UpdateVisiteurError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on updating ressource"
            }
            results.status = 502
        }
        
        return results
    }

    return Visiteur
}