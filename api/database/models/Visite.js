const Op = require("sequelize").Op
const moment = require("moment")

const Format = {

    regularVisiteAttributes: {
        attributes: ["id", "hotel_id", "time_start", "time_end", "visiteur_id_1", "visiteur_id_2"],
        include: [
            {
                association: "hotel",
            }
        ]
    },
    regularVisiteFormat: visiteItem => ({
        id: visiteItem.get("id").toString(),
        start: moment(visiteItem.get("time_start")).format("YYYY-MM-DDTHH:mm:ssZ"),
        end: moment(visiteItem.get("time_end")).format("YYYY-MM-DDTHH:mm:ssZ"),
        title: visiteItem.get("hotel").get("nom"),
        resourceIds: [
            visiteItem.get("visiteur_id_1").toString(),
            visiteItem.get("visiteur_id_2").toString(),
        ],
    })
}

module.exports = (sequelize, DataTypes) => {

    const Visite = sequelize.define('visite', {
        
        visited_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        time_start: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        time_end: {
            type: DataTypes.DATE,
            allowNull: false,
        },

    }, {
        createdAt: false,
        updatedAt: false
    })

    const Visiteur = sequelize.models.visiteur

    // Fetchers


    Visite.getPlanning = async date => {

        const DATE_VALID_FORMAT = "YYYY-MM-DD"
        const DATE_VALID_FORMAT_REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/

        let results = {
            error: false,
            status: 200,
            data: null
        }

        if(date !== null){

            let momentDate = moment(date, DATE_VALID_FORMAT)

            // if match format date and is a correct date (i.e !30 fevrier, !2000-35-01)
            if(DATE_VALID_FORMAT_REGEX.test(date) && momentDate.isValid()){

                let visites = null
        
                try {
        
                    visites = await Visite.findAll({
                        ...Format.regularVisiteAttributes,
                        where: {
                            visited_at: {
                                [Op.between]: [
                                    // OPTI - from dimanche to samedi ???
                                    momentDate.clone().weekday(1),
                                    momentDate.clone().weekday(7),
                                ]
                            }
                        }
                    })
        
                    results.data = {
                        reference: momentDate,
                        events: visites.map(Format.regularVisiteFormat)
                    }
        
                } catch (GetPlanningError) {
                    console.error({GetPlanningError})
                    results.error = {
                        code: 502,
                        message: "BAD GATEWAY - error on fetching planning"
                    }
                    results.status = 502
                }

            } else {
                results.status = 400
                results.error = {
                    message: "BAD REQUEST - invalid date (format must be " + DATE_VALID_FORMAT + ")"
                }
            }
        } else {
            results.status = 400
            results.error = {
                message: "BAD REQUEST - date is null"
            }
        }

        return results

    }

    Visite.getAll = async (offset = 0, limit = 5) => {
        
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let visites = null

        try {
            visites = await Visite.findAll({
                offset: offset * limit,
                limit: limit,
                attributes: ["id", "visited_at", "time_start", "time_end", "visiteur_id_1", "visiteur_id_2"],
                include: [
                    {
                        association: "hotel",
                        attributes: ["id", "ville"]
                    },
                    {
                        association: "voiture",
                        attributes: ["id", "type"]
                    },
                    {
                        association: "rapport",
                        attributes: ["id", "note"]
                    }
                ]
            })
            

            if(visites){

                let item_count = await Visite.count()

                results.data = {
                    pagination: {
                        item_count: item_count,
                        page_current: offset,
                        page_count: Math.ceil(item_count / limit)
                    },
                    visites: visites
                }
            }

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
                console.log(nextVisite)
                const aa = await Visite.update(nextVisite, {
                    where: {
                        id: visiteId
                    }
                })

                console.log("@@@@@")
                console.log("@@@@@")
                console.log({aa})
                console.log("@@@@@")
                console.log("@@@@@")

                // OPTI - may crash if null
                results.data = Format.regularVisiteFormat(await Visite.findByPk(visiteId, Format.regularVisiteAttributes))
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
                visite = await Visite.create(fields)
    
                if(visite){
                    results.data = visite
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