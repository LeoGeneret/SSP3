const Utils = require("../../api.utils")
const Op = require("sequelize").Op

module.exports = (sequelize, DataTypes) => {

    const Rapport = sequelize.define('rapport', {

        note: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        commentaire: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

    }, {
        createdAt: false,
        updatedAt: false
    })

    Rapport.getAll = async userId => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        let rapports = null

        try {

            rapports = await sequelize.models.Visiteur.findByPk(userId, {
                attributes: ["id"],
                include: [
                    {
                        association: "visites",
                        include: [
                            {
                                association: "rapport",
                                required: true
                            },
                            {
                                association: "hotel"
                            }
                        ]
                    }
                ]
            })

            rapports = rapports.visites.map(visite => ({
                id: visite.rapport.id,
                note: visite.rapport.note,
                commentaire: visite.rapport.commentaire,
                is_canceled: visite.is_canceled,
                visite: {
                    id: visite.id,
                    time_start: visite.time_start,
                    time_end: visite.time_end,
                    hotel: visite.hotel,
                }
            }))


            results.data = rapports

        } catch (GetAllRapportError) {
            console.error({GetAllRapportError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on fetching ressources",
            }
            results.status = 502
        }
        return results
    }

    Rapport.getOne = async (rapportId = null) => {

        let results = await Rapport.getAll(undefined, rapportId)

        if(results.data && results.data.length){
            results.data = results.data[0]
        } else {
            console.log('test data NULL !!!!!!')
            results.data = null
        }

        return results
    }

    Rapport.createRapport = async (fields) => {
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let rapport = null

        if(Object.values(fields).some(fieldsItem => fieldsItem === undefined || fieldsItem === null || fieldsItem === "")){
            results.error = {
                code: 400,
                message: "BAD REQUEST - one param is null" + JSON.stringify(fields)
            }
            results.status = 400
        } else {
            try {

                let visitRelated = await sequelize.models.Visite.findByPk(fields.visit_id)

                if(!visitRelated){
                    results.error = {
                        code: 404,
                        message: "NOT FOUND - visit not found"
                    }
                    results.status = 404
                } else {

                    rapport = await Rapport.create(fields)

                    if(rapport){

                        await visitRelated.setRapport(rapport)

                        results.data = rapport
                        results.status = 201
                    }
                }

            } catch (CreateRapportError) {
                console.error({CreateRapportError})
                results.error = {
                    code: 502,
                    message: "BAD GATEWAY - error on creating ressource"
                }
                results.status = 502
            }
        }
        return results
    }

    Rapport.updateRapport = async (rapportId, rapportInfo) => {
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let rapport = null
        let nextRapport = {...rapportInfo}
                
        // Remove undifined keys
        Object.keys(nextRapport).forEach(key => (nextRapport[key] === null || nextRapport[key] === "" || nextRapport[key] === undefined) && delete nextRapport[key])
        
        try {
            [rapportModifiedCount,] = await Rapport.update(nextRapport, {
                where: {
                    id: rapportId
                }
            })

            if(rapportModifiedCount === 1){
                results.data = await Rapport.findByPk(rapportId)
            } else {
                results.error = {
                    code: 404,
                    message: "NOT FOUND - no rapport found"
                }
                results.status = 404
            }
        } catch (UpdateRapportError) {
            console.error({UpdateRapportError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on updating ressource"
            }
            results.status = 502
        }
        
        return results
    }

    Rapport.deleteRapport = async (rapportId = null) => {
        
        if(rapportId === null) {
            return {
                error:{
                    message: "BAD REQUEST - you must specify rapportId",
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

        let rapport = null

        try {
            rapport = await Rapport.destroy({
                where: {
                    id: rapportId
                }
            })
            if(rapport === 0){
                results.error = {
                    code: 404,
                    message: "NOT FOUND - no rapport found"
                }
                results.status = 404
            } else {
                results.status = 202
                results.data = "deleted"
            }
        } catch (DeleteRapportError) {
            console.error({DeleteRapportError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on deleting ressource"
            }
            results.status = 502
        }

        return results
    }

    return Rapport
}