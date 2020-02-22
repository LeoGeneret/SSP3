const sequelize = require("../database/database.index")
const moment = require('moment')
const Op = require('sequelize').Op
const faker = require('faker')

/*
    DOIT ETER RACCORD AVEC Hotel.js
*/
const Format = {

    regularHotelAttributes: {
        include: [
            {
                association: "secteur",
                attributes: ["id", "label"]
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

const randomSubArray= (array, n) => {
    let _array = [...array]

    if(n >= array.length) return array

    return Helpers.loop(n, () => {
        let randomIndex = faker.random.number(_array.length - 1)
        let randomItem = _array[randomIndex]
        _array.splice(randomIndex, 1)
        return randomItem
    })
}

class Algo {

    constructor (){
        //Note a prendre en compte dans la priorisation
        this.noteMediocre = 30
        this.noteMoyenne = 40

        //delai a prendre en compte dans la priorisation
        this.delaiImportant = 12
        this.delaiMoyen = 6
        this.nombreVistesMaxParSemaine = 4
        this.visitehorraire = [8, 10, 14, 16]

    }

    async prioriteSelonDate(){
        var listeHotelsParDate = await sequelize.models.Hotel.findAll({
            
            order: [
                ["hotel_visites", "visited_at", "DESC"]    
            ],
            include: [
                {
                    association: "hotel_visites", 
                    required: true,
                    include: [{
                        required: true,
                        association: "rapport",
                        attributes: ["note", "id"]
                    }]
                },
                {
                    association: "secteur",
                    attributes: ["id", "label"]
                },
            ],
        })
        return listeHotelsParDate.reverse()
    }

    prioriteSelonNote(listeHotels){

        var listeHotelsParNote = listeHotels
        
        //clean other notes (from older rapports)
        for(var a = 0; a<listeHotelsParNote.length; a++){
            while(listeHotelsParNote[a].hotel_visites.length>1){
                listeHotelsParNote[a].hotel_visites.pop()
            }
        }
        listeHotelsParNote.sort(function(a, b) {
            return a.hotel_visites[0].rapport.note - b.hotel_visites[0].rapport.note;
        })

        return listeHotelsParNote
    }

    ajoutHotels(listePrio, listeHotelsParNote, listeHotelsParDate){
        this.ajoutHotelsHauteImportance(listePrio, listeHotelsParNote, listeHotelsParDate)
        this.ajoutHotelsMoyenneImportance(listePrio, listeHotelsParNote, listeHotelsParDate)
        this.ajoutAutresHotels(listePrio, listeHotelsParNote, listeHotelsParDate)
    }

    ajoutHotelsHauteImportance(listePrio, listeHotelsParNote, listeHotelsParDate){
        this.ajoutHotelsParNote(listePrio, listeHotelsParNote, this.noteMediocre)
        this.ajoutHotelsParDate(listePrio, listeHotelsParDate, this.delaiImportant)
    }

    ajoutHotelsMoyenneImportance(listePrio, listeHotelsParNote, listeHotelsParDate){
        this.ajoutHotelsParNote(listePrio, listeHotelsParNote, this.noteMoyenne)
        this.ajoutHotelsParDate(listePrio, listeHotelsParDate, this.delaiMoyen)
    }

    ajoutAutresHotels(listePrio, listeHotelsParNote, listeHotelsParDate){
        //AUTRES NOTES (SUPERIEUR A 40)
        listeHotelsParNote.forEach(function(hotelFromNoteToAdd){
            listePrio.add(hotelFromNoteToAdd)
        });

        //AUTRES DATES (INFERIEUR A 6 MOIS)
        listeHotelsParDate.forEach(function(hotelFromDateToAdd){
            listePrio.add(hotelFromDateToAdd)
        });
    }

    ajoutHotelsParNote(listePrio, listeHotelsParNote, contrainte){
        while((listeHotelsParNote[0].hotel_visites[0].rapport.note)<contrainte){
            listePrio.add(listeHotelsParNote[0])
            listeHotelsParNote.splice(0, 1)
        }
    }

    ajoutHotelsParDate(listePrio, listeHotelsParDate, contrainte){
        while((moment().diff(listeHotelsParDate[0].hotel_visites[0].visited_at, 'months'))>contrainte){
            listePrio.add(listeHotelsParDate[0])
            listeHotelsParDate.splice(0, 1)
        }
    }




    
    //change name : to test
    async creerListePriorisee(){

        var listeHotelsParDate = await this.prioriteSelonDate()
        var listeHotelsParNote = this.prioriteSelonNote(listeHotelsParDate)
        var listePrio = new Set()

        this.ajoutHotels(listePrio, listeHotelsParNote, listeHotelsParDate)

        const listeHotelsFinal = Array.from(listePrio)
        //this.listeDesHotelsAvisiterOrdonnee = Array.from(listePrio)
        const formattedListeHotel = listeHotelsFinal.map(Format.regularHotel)
                
        return formattedListeHotel
    }

    async getHotelFormated(){
        
        let results = {
            error: false,
            status: 200,
            data: null
        }
        
        const formattedListeHotel = await this.creerListePriorisee()

        results.data = {
            pagination: {},
            list: formattedListeHotel
        }

        return results
    }

    async creerPlanning(jour){
        let results = {
            error: false,
            status: 200,
            data: null
        }


        if(jour){

            var listeDesHotelsAvisiterOrdonnee = await this.creerListePriorisee()
            //this.creerVisites(listeDesHotelsAvisiterOrdonnee)
            var listeTestVisit = await this.creerVisites(listeDesHotelsAvisiterOrdonnee, jour)
            var listeNewReturn = []
            listeDesHotelsAvisiterOrdonnee.forEach(function(i){
                listeNewReturn.push(i.id)
            })
            results.data = {
                list: listeTestVisit//listeNewReturn
            }

        } else {
            results.error = {
                message: "BAD REQUEST - date is not defined"
            }
            results.status = 400
        }

        return results
    }

    //Create Liste des visiteurs par secteur (key : secteur; value : visiteurs)
    creerListeVisitesParSecteur(listeVisiteur){
        var secteurId = null
        var ListeDesVisiteursParSecteur = {}

        listeVisiteur.data.visiteurs.forEach(function(visiteur){
                
            secteurId = visiteur.get("secteur_id")

            if(ListeDesVisiteursParSecteur[secteurId]){
                ListeDesVisiteursParSecteur[secteurId].push(visiteur)
            }
            else{
                ListeDesVisiteursParSecteur[secteurId] = [visiteur]
            }
        })

        return ListeDesVisiteursParSecteur
    }

    creerListeBinomes(ListeDesVisiteursParSecteur){

        var binomes = []

        Object.values(ListeDesVisiteursParSecteur).forEach(function(secteur){
            if(secteur.length%2 == 1){
                secteur.pop()
            }
            for(var i = 0; i<secteur.length; i++){
                if(i%2 === 0){
                    binomes.push([secteur[i]])
                }
                else{
                    binomes[binomes.length-1].push(secteur[i])
                }
            }
        })
        return binomes
    }

    //Create object binome par secteur (key : secteur, value : binomes)
    creerBinomesParSecteurs(binomes){

        var binomesParSecteur = {}
        var binomeSecteur = null

        binomes.forEach(function(binomeDansBinomes){
                    
            binomeSecteur = binomeDansBinomes[0].secteur_id

            if(binomesParSecteur[binomeSecteur]){
                binomesParSecteur[binomeSecteur].push(binomeDansBinomes)
            }
            else{
                binomesParSecteur[binomeSecteur] = [binomeDansBinomes]
            }
        })
        return binomesParSecteur
    }

    //Create Liste des Hotels par secteur (key : secteur, value : hotels)
    creerHotelsParSecteur(listeDesHotelsAvisiterOrdonnee){

        var ListeDesHotelsParSecteur = {}
        var secteurHotel = null

        listeDesHotelsAvisiterOrdonnee.forEach(function(hotelAvisiter){
                    
            secteurHotel = hotelAvisiter.secteur.id

            if(ListeDesHotelsParSecteur[secteurHotel]){
                ListeDesHotelsParSecteur[secteurHotel].push(hotelAvisiter)
            }
            else{
                ListeDesHotelsParSecteur[secteurHotel] = [hotelAvisiter]
            }
        })

        return ListeDesHotelsParSecteur
    }


    creerVisitesPlanning(binomesParSecteur, ListeDesHotelsParSecteur, jour){

        var jourRef = moment(jour)
        var visites = []

        Object.keys(binomesParSecteur).forEach((binomesDansSecteur)=>{
            binomesParSecteur[binomesDansSecteur].forEach((binome)=>{
                var hotelsDansSecteur = ListeDesHotelsParSecteur[binomesDansSecteur]
                if(hotelsDansSecteur && hotelsDansSecteur.length){
                    for (var i = 0; i<this.nombreVistesMaxParSemaine; i++){
                        const jourSemaine = jourRef.clone().weekday(i+1)
                        for (var j = 0; j<this.visitehorraire.length; j++){
                            
                            const hotel = hotelsDansSecteur.shift()
                            
                            if(hotel){
                                const visited_at = jourSemaine.clone().hour(this.visitehorraire[j])
                                const time_start = visited_at
                                const time_end = visited_at.clone().add(1, 'hour')
                                const visiteur_id_1 = binome[0].get("id")
                                const visiteur_id_2 = binome[1].get("id")
                                const voiture_id = 1
                                const hotel_id = hotel.id
                                visites.push({
                                    visited_at: visited_at,
                                    time_start: time_start,
                                    time_end: time_end,
                                    hotel_id: hotel_id,
                                    voiture_id: voiture_id,
                                    visiteur_id_1: visiteur_id_1,
                                    visiteur_id_2: visiteur_id_2
                                })
                            }

                        }
                    }
                }
                
            })
        })
        return visites
    }

    async creerVisites(listeDesHotelsAvisiterOrdonnee, jour) {

        var listeVisiteur = await sequelize.models.Visiteur.getAll(undefined, undefined, undefined, true)

        if(listeVisiteur.error) {
        }
        else {

            var ListeDesVisiteursParSecteur = this.creerListeVisitesParSecteur(listeVisiteur)  
            var binomes = this.creerListeBinomes(ListeDesVisiteursParSecteur)
            var binomesParSecteur = this.creerBinomesParSecteurs(binomes)
            var ListeDesHotelsParSecteur = this.creerHotelsParSecteur(listeDesHotelsAvisiterOrdonnee)
            var visites = this.creerVisitesPlanning(binomesParSecteur, ListeDesHotelsParSecteur, jour)
            const visitesCreated  = await sequelize.models.Visite.bulkCreate(visites)

            return visitesCreated
        }

    }
}


module.exports = new Algo()