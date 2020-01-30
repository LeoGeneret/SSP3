
module.exports = (sequelize, DataTypes) => {

    const Hotel = sequelize.define('hotel', {

        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        adresse: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        code_postal: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        ville: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        nombre_chambre: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        // status @WAIT

    }, {
        createdAt: false,
        updatedAt: false
    })


    Hotel.getAll = async (offset = 0, limit = 5) => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        let hotels = null

        try {
            hotels = await Hotel.findAll({
                offset: offset * limit,
                limit: limit
            })

            if(hotels){

                let item_count = await Hotel.count()

                results.data = {
                    pagination: {
                        item_count: item_count,
                        page_current: offset,
                        page_count: Math.ceil(item_count / limit)
                    },
                    hotels: hotels
                }
            }

        } catch (GetAllHotelError) {
            console.error({GetAllHotelError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on fetching ressources"
            }
            results.status = 502
        }

        return results
    }

    return Hotel
}