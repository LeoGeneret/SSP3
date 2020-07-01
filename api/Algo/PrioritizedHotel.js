
// Libs
const moment = require("moment")

// Components
const sequelize = require("../database/database.index")
const Utils = require("../api.utils")


function sortByDate(a, b){

    let dateA = moment(a.last_visited_at)
    let dateB = moment(b.last_visited_at)

    return dateA.diff(dateB)
}

function sortByNote(a, b){
    return a.last_note - b.last_note
}


const NOTE_MAX = 60

module.exports = {

    getAll: async function() {

        let results = {
            status: 200,
            data: null,
            error: null,
        }

        let hotelsResults = await sequelize.models.Hotel.getAll()

        results = {...hotelsResults}

        if(!results.error){

            let hotels = results.data.hotels


            // trie par date de derniere visite
            hotels.sort(sortByDate)

            // filtrer par by note over 6 month ago
            let sixmonthAgo = moment().subtract(6, "month")
            let filter1 = Utils.filterPop(hotels, hotel => {

                let lastVisitMoment = moment(hotel.last_visited_at)
                let diffSixMonthAgo = sixmonthAgo.diff(lastVisitMoment, "day")

                if(Utils.isNullOrUndefined(hotel.last_note)){
                    return true
                } 
                else if(diffSixMonthAgo > 0){
                    return true
                } 
                else {
                    return false
                }

            })
            hotels = filter1.rest
            
            // add words rated hotel on top
            filter1.filtered.sort(sortByNote)
            hotels.unshift(...filter1.filtered)

            // add hight-priority hotel on the top
            let filter2 = Utils.filterPop(hotels, hotel => hotel.priority)
            hotels = filter2.rest
            hotels.unshift(...filter2.filtered)

            // add never visited hotel on the top
            let filter3 = Utils.filterPop(hotels, hotel => Utils.isNullOrUndefined(hotel.last_visited_at))
            hotels = filter3.rest
            hotels.unshift(...filter3.filtered)

            results.data.hotels = hotels
        }

        return results
    }
}