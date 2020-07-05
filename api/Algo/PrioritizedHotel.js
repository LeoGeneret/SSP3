
// Libs
const moment = require("moment")

// Components
const sequelize = require("../database/database.index")
const Utils = require("../api.utils")

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function sortByDate(a, b){

    let dateA = moment(a.last_visited_at)
    let dateB = moment(b.last_visited_at)

    return dateA.diff(dateB)
}

function sortByNote(a, b){
    return a.last_note - b.last_note
}


const NOTE_MAX = 60

const VISITS_PER_DAY = 4
const DAY_PER_WEEK = 5

// as VISITS_PER_DAY = 4
const VISIT_SLOTS = [
    8, 10, 14, 16
]

const PrioritizedHotel = {


    getBySecteur: resources => {
        let resourcesBySecteur = {}
        resources.map(resourcesItem => {

            let secteurLabel = resourcesItem.secteur.label
            
            if(resourcesBySecteur[secteurLabel]){
                resourcesBySecteur[secteurLabel].push(resourcesItem)
            } else {
                resourcesBySecteur[secteurLabel] = [resourcesItem]
            }

        })

        return resourcesBySecteur
    },

    generateBinomesBySecteur(visiteursBySecteur){
        let binomesBySecteur = {}

        for(secteur in visiteursBySecteur){
            let visiteursDuSecteur = [...visiteursBySecteur[secteur]]

            binomesBySecteur[secteur] = [[]]
            let binomesDuSecteurs = binomesBySecteur[secteur]

            while(visiteursDuSecteur.length){
                

                let index = randomInteger(0, visiteursDuSecteur.length - 1)

                let retrievedElement = visiteursDuSecteur[index]

                if(binomesDuSecteurs[binomesDuSecteurs.length - 1].length < 2){
                    binomesDuSecteurs[binomesDuSecteurs.length - 1].push(retrievedElement)
                } else {
                    binomesDuSecteurs.push([retrievedElement])
                }

                visiteursDuSecteur.splice(index, 1)
            }

            binomesBySecteur[secteur] = binomesBySecteur[secteur].map((b, index) => ({
                visiteurs: b,
                index: index
            }))
        }

        return binomesBySecteur
    },

    createPlanning: async function(){
        let results = {
            data: null,
            error: null,
            status: 200,
        }

        try{
            let hotelsResults = await PrioritizedHotel.getAll()
            results = {...hotelsResults}
    
            if(!results.error){
    
                let hotels = hotelsResults.data
    
                let visiteursResults = await sequelize.models.Visiteur.getAll()
                results = {...visiteursResults}
                
                if(!results.error){
                    let visiteurs = visiteursResults.data.visiteurs
    
                    
                    // ready
                    hotels = hotels.map((h, i) => Object.assign(h, {priority_rank: i}))
    
                    let hotelsBySecteur = PrioritizedHotel.getBySecteur(hotels)
                    let visiteursBySecteur = PrioritizedHotel.getBySecteur(visiteurs)
                    let binomesBySecteur = PrioritizedHotel.generateBinomesBySecteur(visiteursBySecteur)   
                    
                    let visites = []
    
                    let weekReference = moment().add(1, "week").startOf("week")
    
                    for(secteur in hotelsBySecteur){
    
                        let hotelsDuSecteur = [...hotelsBySecteur[secteur]]
                        let binomesDuSecteur = binomesBySecteur[secteur]
                        
                        let binomeIndex = 0
    
                        while(hotelsDuSecteur.length && !binomesDuSecteur.every(binome => binome.visit_count >= VISITS_PER_DAY * DAY_PER_WEEK)){
    
                            // get binome
                            let assignedBinome = binomesDuSecteur[binomeIndex % binomesDuSecteur.length]
    
                            if(assignedBinome.visit_count >= VISITS_PER_DAY * DAY_PER_WEEK){
                                continue;
                            } else {
    
                                // get hotel
                                let retrievedHotel = hotelsDuSecteur[0]
                                hotelsDuSecteur.shift()
        
                                // assign visite
    
                                assignedBinome.visit_count = (assignedBinome.visit_count || 0) + 1
    
    
                                let day = Math.floor(assignedBinome.visit_count / VISITS_PER_DAY)
                                let hour = VISIT_SLOTS[(assignedBinome.visit_count - 1 )% VISIT_SLOTS.length]

    
                                let time_start = weekReference.clone().day(day).hour(hour).startOf("hour")
                                let time_end = time_start.clone().add(1, "hour")
    
                                visites.push({
                                    hotel_id: retrievedHotel.id,
                                    time_start: time_start,
                                    time_end: time_end,
                                    visiteurs: assignedBinome.visiteurs.map(b => b.id),
                                })
        
                                // increment 
                                binomeIndex++
                            }
                        }
                    }
    
                    results.data = visites

                    const createdVisites = await Promise.all(visites.map(visitesItem => {
    
                        return sequelize.models.Visite.create(visitesItem)
                        
                        .then(createdVisite => {
                            return sequelize.getQueryInterface().bulkInsert("visiteur_visites", visitesItem.visiteurs.map(visiteurId => ({
                                visite_id: createdVisite.get("id"),
                                visiteur_id: visiteurId 
                            }))).then(() => createdVisite)
                        })
            
                    }))
    
                    results.data = createdVisites
    
                }
            }
        } catch (CreatingPlanningError){
            console.error({CreateVisiteError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on creating planning"
            }
            results.status = 502
        }

        return results
    },

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
            results.data = hotels
        }

        return results
    }
}

module.exports = PrioritizedHotel