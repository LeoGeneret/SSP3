
module.exports = (sequelize, DataTypes) => {

    const Voiture = sequelize.define('voiture', {

        immatriculation: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        type: {
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
    
        // status @WAIT

    }, {
        createdAt: false,
        updatedAt: false
    })

    Voiture.getAll = async (offset = 0, limit = 5) => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        let voitures = null

        try {
            voitures = await Voiture.findAll({
                offset: offset * limit,
                limit: limit
            })

            if(voitures){

                let item_count = await Voiture.count()

                results.data = {
                    pagination: {
                        item_count: item_count,
                        page_current: offset,
                        page_count: Math.ceil(item_count / limit)
                    },
                    voitures: voitures
                }
            }

        } catch (GetAllVoitureError) {
            console.error({GetAllVoitureError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on fetching ressources"
            }
        }

        return results
    }

    return Voiture
}