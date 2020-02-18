
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

        priority: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
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

    Hotel.deleteHotel = async (hotelId = null) => {
        
        if(hotelId === null) {
            return {
                error:{
                    message: "BAD REQUEST - you must specify hotelId",
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

        let hotel = null

        try {
            hotel = await Hotel.destroy({
                where: {
                    id: hotelId
                }
            })
            if(hotel === 0){
                results.error = {
                    code: 404,
                    message: "NOT FOUND - no hotel found"
                }
                results.status = 404
            } else {
                results.status = 202
                results.data = "deleted"
            }
        } catch (DeleteHotelError) {
            console.error({DeleteHotelError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on deleting ressource"
            }
            results.status = 502
        }

        console.log({afterQuery: results})

        return results
    }

    Hotel.createHotel = async (fields) => {
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let hotel = null

        if(Object.values(fields).some(fieldsItem => fieldsItem === undefined || fieldsItem === null || fieldsItem === "")){
            results.error = {
                code: 400,
                message: "BAD REQUEST - one param is null" + JSON.stringify(fields)
            }
            results.status = 400
        } else {
            try {
                hotel = await Hotel.create(fields)
    
                if(hotel){
                    results.data = hotel
                    results.status = 201
                }
            } catch (CreateHotelError) {
                console.error({CreateHotelError})
                results.error = {
                    code: 502,
                    message: "BAD GATEWAY - error on creating ressource"
                }
                results.status = 502
            }
        }
        return results
    }

    Hotel.updateHotel = async (hotelId, hotelInfo) => {
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let hotel = null
        let nextHotel = {...hotelInfo}
                
        // Remove undifined keys
        Object.keys(nextHotel).forEach(key => (nextHotel[key] === null || nextHotel[key] === "" || nextHotel[key] === undefined) && delete nextHotel[key])
        
        try {
            [hotelModifiedCount,] = await Hotel.update(nextHotel, {
                where: {
                    id: hotelId
                }
            })

            if(hotelModifiedCount === 1){
                results.data = await Hotel.findByPk(hotelId)
            } else {
                results.error = {
                    code: 404,
                    message: "NOT FOUND - no hotel found"
                }
                results.status = 404
            }
        } catch (UpdateHotelError) {
            console.error({UpdateHotelError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on updating ressource"
            }
            results.status = 502
        }
        
        return results
    }

    return Hotel
}