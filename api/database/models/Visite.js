
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

    // Fetchers

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
                attributes: ["id", "visited_at", "time_start", "time_end"],
                include: [
                    {
                        association: "binome",
                        attributes: ["id"],
                        include: [
                            {
                                association: "visiteur_1",
                                attributes: ["id", "nom"],
                            },
                            {
                                association: "visiteur_2",
                                attributes: ["id", "nom"],
                            },
                        ]
                    },
                    {
                        association: "hotel",
                        attributes: ["id", "ville"]
                    },
                    {
                        association: "visite",
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
            [modifiedVisiteCount,] = await Visite.update(nextVisite, {
                where: {
                    id: visiteId
                }
            })

            if(modifiedVisiteCount === 1){
                results.data = await Visite.findByPk(visiteId)
            } else {
                results.error = {
                    code: 404,
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
                message: "BAD REQUEST - one param is null"
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