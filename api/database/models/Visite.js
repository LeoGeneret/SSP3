
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


    const Visiteur = sequelize.import("./Visiteur")

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
        }

        return results
    }

    return Visite
}