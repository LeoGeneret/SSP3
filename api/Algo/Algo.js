const sequelize = require("../database/database.index")
const moment = require('moment')
const Op = require('sequelize').Op
const faker = require('faker')

const Format = {

    regularHotelAttributes: {
        attributes: ["id", "priority", "nom"],
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
            priority: hotelsItem.get("priority"),
            secteur: hotelsItem.get("secteur"),
            visited_at: hotelsItem.get("hotel_visites") && hotelsItem.get("hotel_visites")[0] && hotelsItem.get("hotel_visites")[0].get("visited_at"),
            note: hotelsItem.get("hotel_visites") && 
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
        this.nombreVistesMaxParJour = 4

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

    prioriteSelonNoteFunction(listeHotels){

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
    async prioriteSelonNote(){

        var listeHotelsParDate = await this.prioriteSelonDate()
        var listeHotelsParNote = this.prioriteSelonNoteFunction(listeHotelsParDate)
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
        
        const formattedListeHotel = await this.prioriteSelonNote()

        results.data = {
            pagination: {},
            list: formattedListeHotel
        }

        return results
    }

    async creerPlanning(){
        let results = {
            error: false,
            status: 200,
            data: null
        }

        //this.prioriteSelonNote()

        var listeDesHotelsAvisiterOrdonnee = await this.prioriteSelonNote()
        //this.creerVisites(listeDesHotelsAvisiterOrdonnee)
        var listeTestVisit = await this.creerVisites(listeDesHotelsAvisiterOrdonnee)
        var listeNewReturn = []
        listeDesHotelsAvisiterOrdonnee.forEach(function(i){
            listeNewReturn.push(i.id)
        })
        results.data = {
            list: listeTestVisit//listeNewReturn
        }

        return results
    }


    async creerVisites(listeDesHotelsAvisiterOrdonnee) {
        //tant qu'il reste des hotels a visiter et que < a ?

        //Visite.cre
        //ajouterDateVisite
        //ajouterHotel
        //ajouterVoiture
        //ajouterBinome

        var listeVisiteur = await sequelize.models.Visiteur.getAll(undefined, undefined, undefined, true)

       //console.log(listeVisiteur)

       var listeBinomes = []
       var ListeDesVisiteursParSecteur = {}
       var secteurId = null
       var binomes = []
       var isFirst = true
       var ListeDesHotelsParSecteur = {}
       var binomesParSecteur = {}
       var binomeSecteur = null



        if(listeVisiteur.error) {

        }
        else {
            listeVisiteur.data.visiteurs.forEach(function(visiteur){
                
                secteurId = visiteur.get("secteur_id")

                if(ListeDesVisiteursParSecteur[secteurId]){
                    ListeDesVisiteursParSecteur[secteurId].push(visiteur)
                }
                else{
                    ListeDesVisiteursParSecteur[secteurId] = [visiteur]
                }
            })

            Object.values(ListeDesVisiteursParSecteur).forEach(function(secteur){
                //console.log(secteur)
                for(var i = 0; i<secteur.length; i++){
                    if(secteur.length%2 == 1){
                        secteur.pop()
                    }
                    if(i%2 === 0){
                        binomes.push([secteur[i]])
                    }
                    else{
                        binomes[binomes.length-1].push(secteur[i])
                    }

                }
       
            })
        }

        listeVisiteur.data.visiteurs.forEach(function(visiteur){
                
            secteurId = visiteur.get("secteur_id")

            if(ListeDesVisiteursParSecteur[secteurId]){
                ListeDesVisiteursParSecteur[secteurId].push(visiteur)
            }
            else{
                ListeDesVisiteursParSecteur[secteurId] = [visiteur]
            }
        })


        var tableauBinomes = await sequelize.models.Binome.bulkCreate(binomes.map(binome => {
            return {
                visiteur_id_1: binome[0].get("id"),
                visiteur_id_2: binome[1].get("id")
            }
        }))


        //console.log(listeDesHotelsAvisiterOrdonnee.data)

        binomes.forEach(function(binomeDansBinomes){
                
            binomeSecteur = binomeDansBinomes[0].secteur_id

            if(binomesParSecteur[binomeSecteur]){
                binomesParSecteur[binomeSecteur].push(binomeDansBinomes)
            }
            else{
                binomesParSecteur[binomeSecteur] = [binomeDansBinomes]
            }
        })

        

        listeDesHotelsAvisiterOrdonnee.forEach(function(hotelToCreate){
            



            // if(hotelToCreate.secteur_id){
                
            // }
            
            
            sequelize.models.Visite.create({
                //num jour, num mois, num annee
                visited_at: new Date(2020,3,20),
                //heure debut
                time_start: moment(),
                //heure fin
                time_end: moment(),
                //idHotel
                hotel_id: hotelToCreate.id,
                //idvoiture
                voiture_id: 2,
                //idbinome
                binome_id: 1
           })
        })

        return binomesParSecteur

    }
}


module.exports = new Algo()