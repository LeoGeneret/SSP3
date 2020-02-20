

/*
    DOIT ETER RACCORD AVEC ALGO.js
*/
const Format = {

    regularHotelAttributes: {
        include: [
            {
                association: "secteur",
                attributes: ["id", "label"]
            },
            {
                association: "hotel_visites",
                attributes: ["visited_at", "rapport_id"],
                separate: true,
                order: [
                    ["visited_at", "DESC"]
                ],
                limit: 1,
                include: [
                    {
                        association: "rapport",
                        attributes: ["note"]
                    }
                ]
            }
        ]
    },

    regularHotel: hotelsItem => {
        return {
            id: hotelsItem.get("id"),
            nom: hotelsItem.get("nom"),
            code_postal: hotelsItem.get("code_postal"),
            priority: hotelsItem.get("priority"),
            secteur: hotelsItem.get("secteur"),
            ville: hotelsItem.get("ville"),
            adresse: hotelsItem.get("adresse"),
            nombre_chambre: hotelsItem.get("nombre_chambre"),
            last_visited_at: hotelsItem.get("hotel_visites") && hotelsItem.get("hotel_visites")[0] && hotelsItem.get("hotel_visites")[0].get("visited_at"),
            last_note: hotelsItem.get("hotel_visites") && 
                hotelsItem.get("hotel_visites")[0] && hotelsItem.get("hotel_visites")[0].get("rapport") &&
                        hotelsItem.get("hotel_visites")[0].get("rapport").get("note"),
        }
    }
}

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

        priority: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        // status @WAIT

    }, {
        createdAt: false,
        updatedAt: false
    })

    const Op = require("sequelize").Op

    Hotel.getAll = async (offset = 0, limit = 5, search) => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        let hotels = null

        try {

            let queryParameters = {
                offset: offset * limit,
                limit: limit,
                ...Format.regularHotelAttributes,

                // add search parameters if search is defined
                ...(
                    search ? {
                        where: {
                            nom: {
                                [Op.substring]: search
                            }
                        }
                    } : {}
                )
            }

            hotels = await Hotel.findAll(queryParameters)

            if (hotels) {

                let item_count = await Hotel.count(queryParameters)

                results.data = {
                    pagination: {
                        item_count: item_count,
                        page_current: offset,
                        page_count: Math.ceil(item_count / limit)
                    },
                    hotels: hotels.map(Format.regularHotel)
                }
            }

        } catch (GetAllHotelError) {
            console.error({ GetAllHotelError })
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on fetching ressources"
            }
            results.status = 502
        }

        return results
    }

    Hotel.deleteHotel = async (hotelId = null) => {

        if (hotelId === null) {
            return {
                error: {
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
            if (hotel === 0) {
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
            console.error({ DeleteHotelError })
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on deleting ressource"
            }
            results.status = 502
        }

        console.log({ afterQuery: results })

        return results
    }

    Hotel.createHotel = async (fields) => {
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let hotel = null

        if (Object.values(fields).some(fieldsItem => fieldsItem === undefined || fieldsItem === null || fieldsItem === "")) {
            results.error = {
                code: 400,
                message: "BAD REQUEST - one param is null" + JSON.stringify(fields)
            }
            results.status = 400
        } else {
            try {
                hotel = await Hotel.create(fields)
    
                if(hotel){
                    const createdHotel = await Hotel.findByPk(hotel.get("id"), Format.regularHotelAttributes)
                    results.data = Format.regularHotel(createdHotel)
                    results.status = 201
                }
            } catch (CreateHotelError) {
                console.error({ CreateHotelError })
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
        let nextHotel = { ...hotelInfo }

        // Remove undifined keys
        Object.keys(nextHotel).forEach(key => (nextHotel[key] === null || nextHotel[key] === "" || nextHotel[key] === undefined) && delete nextHotel[key])

        try {

            // verifiy existence
            let foundHotel = await Hotel.findByPk(hotelId, {
                attributes: ["id"]
            })

            // if found perform an update
            if (foundHotel) {
                await Hotel.update(nextHotel, {
                    where: {
                        id: hotelId
                    }
                })

                // OPTI - may crash if null
                const createdHotel = await Hotel.findByPk(hotelId, Format.regularHotelAttributes)
                results.data = Format.regularHotel(createdHotel)
            } else {
                results.error = {
                    message: "NOT FOUND - no hotel found"
                }
                results.status = 404
            }
        } catch (UpdateHotelError) {
            console.error({ UpdateHotelError })
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