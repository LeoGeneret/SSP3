const moment = require("moment")

module.exports = {

    Visite: {
        queryParameters: queryParameters => {
            return {
                ...queryParameters,
                include: [
                    {
                        association: "visiteurs",
                    },
                    {
                        association: "hotel",
                    },
                    {
                        association: "rapport"
                    }
                ]
            }
        },
        
        format: visiteItem => {

            return {
                id: visiteItem.get("id"),
                id_string: visiteItem.get("id").toString(),
                start: moment(visiteItem.get("time_start")).format("YYYY-MM-DDTHH:mm:ssZ"),
                end: moment(visiteItem.get("time_end")).format("YYYY-MM-DDTHH:mm:ssZ"),
                hotel: visiteItem.get("hotel"),
                is_canceled: visiteItem.get("is_canceled"),
                agents: visiteItem.visiteurs,
                rapport: visiteItem.get("rapport"),
            }
        }
    }

}