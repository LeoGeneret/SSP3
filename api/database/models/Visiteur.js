
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


    Visiteur.getAll = async (offset = 0, limit = 5) => {
        
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let visiteurs = null

        try {
            visiteurs = await Visiteur.findAll({
                offset: offset * limit,
                limit: limit
            })

            if(visiteurs){

                let item_count = await Visiteur.count()

                results.data = {
                    pagination: {
                        item_count: item_count,
                        page_current: offset,
                        page_count: Math.ceil(item_count / limit)
                    },
                    visiteurs: visiteurs
                }
            }

        } catch (GetAllVisiteurError) {
            console.error({GetAllVisiteurError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on fetching ressources"
            }
        }

        return results
    }

    return Visiteur
}