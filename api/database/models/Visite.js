const Op = require("sequelize").Op
const moment = require("moment")
const Utils = require("../../api.utils")
const Format = require("../../data-format")

module.exports = (sequelize, DataTypes) => {

    const Visite = sequelize.define('visite', {

        time_start: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        time_end: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        is_canceled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: true
        }

    }, {
        createdAt: false,
        updatedAt: false
    })


    const Helpers = {
        setVisiteurs: async (visitModel, visiteursIds) => {
            let nextVisiteurs = visiteursIds.map(id => {
                return sequelize.models.Visiteur.findByPk(id, {attributes: ["id"]}).then(visiteur => visiteur ? visiteur : null)
            })
    
            nextVisiteurs = await Promise.all(nextVisiteurs)
    
            if(nextVisiteurs.every(v => v)){
                await visitModel.setVisiteurs(nextVisiteurs)
            }

            return nextVisiteurs
        }
    }

    Visite.getAll = async (week, day, userId) => {
        
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let visites = null

        week = week && moment(week, "YYYY-MM-DD")
        day = day && moment(day, "YYYY-MM-DD")

        if(!week && !day){
            results.error = {
                message: "BAD REQUEST - week or day is null",
                code: 400
            }
            results.status = 400

            return results
        }

        let queryParameters = {}

        try {

            if (week){
                queryParameters = {
                    where: {
                        time_start: {
                            [Op.between]: [
                                // OPTI - from dimanche to samedi ???
                                week.clone().weekday(0),
                                week.clone().weekday(6),
                            ]
                        }
                    }
                }

            }
            else {
                queryParameters = {
                    where: {
                        time_start: {[Op.between]: [
                            // OPTI - from dimanche to samedi ???
                            day.clone().hour(0),
                            day.clone().hour(23),
                        ]}
                    }
                }
            }

            console.log({userId})
            if(Utils.isNullOrUndefined(userId)){
                console.log("xxxxx")
                visites = await Visite.findAll(Format.Visite.queryParameters({
                    ...queryParameters      
                })).map(v => Format.Visite.format(v))
            } else {

                console.log("HERERERE ")
                let visiteur = await sequelize.models.Visiteur.findByPk(userId, {
                    attributes: ["id"],
                    include: [
                        Format.Visite.queryParameters({
                            association: "visites",
                            ...queryParameters,
                            required: false,
                        })
                    ]
                })

                visites = visiteur.visites.map(v => Format.Visite.format(v))
            }

            results.data = visites

        } catch (GetAllVisiteError) {
            console.error({GetAllVisiteError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on fetching ressources"
            }
            results.status = 502
        }

        return results
    }


    Visite.deleteVisite = async (visiteId = null) => {
        
        if(visiteId === null) {
            return {
                error:{
                    message: "BAD REQUEST - you must specify visiteId",
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

        let visite = null

        try {
            visite = await Visite.destroy({
                where: {
                    id: visiteId
                }
            })

            if(visite === 0){
                results.error = {
                    code: 404,
                    message: "NOT FOUND - no visite found"
                }
                results.status = 404
            } else {
                results.status = 202
                results.data = "deleted"
            }
        } catch (DeleteVisiteError) {
            console.error({DeleteVisiteError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on deleting ressource"
            }
            results.status = 502
        }

        return results
    }


    Visite.updateVisite = async (visiteId, fields) => {
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let visite = null
        let nextVisite = {...fields}
        
        // Remove undefined keys
        Object.keys(nextVisite).forEach(key => (nextVisite[key] === null || nextVisite[key] === "" || nextVisite[key] === undefined) && delete nextVisite[key])
        
        try {

            // verifiy existence
            let foundVisite = await Visite.findByPk(visiteId, {
                attributes: ["id"]
            })

            // if found perform an update
            if (foundVisite) {
                await Visite.update(nextVisite, {
                    where: {
                        id: visiteId
                    }
                })  

                
                /* Update visiteurs */
                if(nextVisite.visiteurs && nextVisite.visiteurs.length){

                    let visiteurs = await Helpers.setVisiteurs(foundVisite, nextVisite.visiteurs)

                    if(!visiteurs.length){
                        results.error = {
                            message: "NOT FOUND - visiteur not found"
                        }
                        results.status = 404
                        return results
                    }
                }

                // OPTI - may crash if null
                results.data = Format.Visite.format(await Visite.findByPk(visiteId, Format.Visite.queryParameters({

                })))

            } else {
                results.error = {
                    message: "NOT FOUND - no visite found"
                }
                results.status = 404
            }

        } catch (UpdateVisiteError) {
            console.error({UpdateVisiteError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on updating ressource"
            }
            results.status = 502
        }
        
        return results
    }


    Visite.createVisite = async (fields) => {
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let visite = null

        if(Object.values(fields).some(fieldsItem => fieldsItem === undefined || fieldsItem === null || fieldsItem === "")){
            results.error = {
                code: 400,
                message: "BAD REQUEST - one param is null" + JSON.stringify(fields)
            }
            results.status = 400
        } else {
            try {

                
                let visiteurs = await Helpers.setVisiteurs(visite, fields.visiteurs)

                if(!visiteurs.length){
                    results.error = {
                        message: "NOT FOUND - visiteur not found"
                    }
                    results.status = 404
                    return results
                }
    

                if(visite){

                    const createdVisite = await Visite.findByPk(visite.get("id"), Format.Visite.queryParameters)
                    
                    results.data = Format.Visite.format(createdVisite)
                    results.status = 201
                }
            } catch (CreateVisiteError) {
                console.error({CreateVisiteError})
                results.error = {
                    code: 502,
                    message: "BAD GATEWAY - error on creating ressource"
                }
                results.status = 502
            }
        }
        return results
    }

    return Visite
}