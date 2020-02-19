require("dotenv").config()

//const sequelize = require('../api.routes')
const sequelize = require("../database/database.index")
const moment = require('moment')
const Op = require('sequelize').Op

//const listeHotels = sequelize.models.Visite.findAll({});



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




class Visites {
    
    ajouterDateVisite(){
        // sequelize.models.Visite.create({
        //      visited_at: moment().day(20).month(3).year(2020)
        // })
    }

    ajouterHotel(){
        
    }

    ajouterVoiture(){
        
    }

    ajouterBinome(){
        
    }
    createListeHotelsPriorisee(){
        
    }

    async prioriteSelonDerniereVisite(){
        var listeHotels = await sequelize.models.Hotel.findAll({
            order: [
                [{association: "hotel_visites"},"visited_at", "ASC"]
            ],
            include: [{
                association: "hotel_visites"
            }]
        })
        //var listeHotelsPrioritaires = []
        
        //console.log(listeHotels)
        // var listeHotelsImportants
        //var idHotel;
        //var dateDerniereVisiteHotel;

        return listeHotels
    }

    async prioriteSelonDate(){
        var listeHotelsParDate = await sequelize.models.Hotel.findAll({

            order: [
                ["hotel_visites", "visited_at", "DESC"]
            ],
            
            include: [{
                association: "hotel_visites", 
                required: true,
                include: [{
                    association: "rapport",
                    attributes: ["note", "id"]
                }]
            }],
        })
        return listeHotelsParDate.reverse()
    }

    async prioriteSelonNoteDeux(){
        
        var listeHotelsParNote = []
        var listeHotelsParDate = this.prioriteSelonDate()

        for(var z = 0; z<listeHotelsParDate.length; z++){
            listeHotelsParNote.push(listeHotelsParDate[z])
        }
        return listeHotelsSelonNote
    }


    generateListePrioritaire(){
        // prioriteSelonNote();
        // prioriteSelonDate();
    }

    //change name : to test
    async prioriteSelonNote(){
        
        // PAR DATE
        var listeHotelsParDate = await sequelize.models.Hotel.findAll({

            order: [
                ["hotel_visites", "visited_at", "DESC"]
                //["hotel_visites", "rapport","note", "ASC"]
                
            ],
            
            include: [{
                association: "hotel_visites", 
                required: true,
                include: [{
                    association: "rapport",
                    attributes: ["note", "id"]
                }]
                //attributes: ["rapport_id"]
            }],
        })

        var listePrio = new Set()
        var prioUneNote = false
        var listeHotelsParNote = []
        //var listeHotelsParNote = listeHotelsParDate
        for(var z = 0; z<listeHotelsParDate.length; z++){
            listeHotelsParNote.push(listeHotelsParDate[z])
        }
        
        const listeHotelsPrio = new Set()

        //clean other notes (from older rapports)
        for(var a = 0; a<listeHotelsParNote.length; a++){
            while(listeHotelsParNote[a].hotel_visites.length>1){
                listeHotelsParNote[a].hotel_visites.pop()
            }
        }

        listeHotelsParNote.sort(function(a, b) {
            return a.hotel_visites[0].rapport.note - b.hotel_visites[0].rapport.note;
        });

        var testtrenteNote = []
        var testdixDate = []

        for(var ab = 0; ab<listeHotelsParNote.length; ab++){
            testtrenteNote.push(listeHotelsParNote[ab])
        }

        

        var listeHotelsParDatesVisitesPlusAnciennes = listeHotelsParDate.reverse();
        
        for(var cd = 0; cd<listeHotelsParDatesVisitesPlusAnciennes.length; cd++){
            testdixDate.push(listeHotelsParDatesVisitesPlusAnciennes[cd])
        }
        //###################################
        //AJOUT HOTELS IMPORTANCE HAUTE
        //###################################

        //NOTE INFERIEUR A 30
        while((listeHotelsParNote[0].hotel_visites[0].rapport.note)<30){
            listePrio.add(listeHotelsParNote[0])
            listeHotelsParNote.splice(0, 1)
        }

        //DATE SUPERIEURE A 12 MOIS
        while((moment().diff(listeHotelsParDatesVisitesPlusAnciennes[0].hotel_visites[0].visited_at, 'months'))>12){
                listePrio.add(listeHotelsParDatesVisitesPlusAnciennes[0])
                listeHotelsParDatesVisitesPlusAnciennes.splice(0, 1)
        }

        //###################################
        //AJOUT HOTELS IMPORTANCE MOYENNE
        //###################################

        //NOTE INFERIEUR A 40
        while((listeHotelsParNote[0].hotel_visites[0].rapport.note)<40){
            listePrio.add(listeHotelsParNote[0])
            listeHotelsParNote.splice(0, 1)
        }

        //DATE SUPERIEURE A 6 MOIS
        while((moment().diff(listeHotelsParDatesVisitesPlusAnciennes[0].hotel_visites[0].visited_at, 'months'))>6){
                listePrio.add(listeHotelsParDatesVisitesPlusAnciennes[0])
                listeHotelsParDatesVisitesPlusAnciennes.splice(0, 1)
        }

        //###################################
        //AJOUT HOTELS AUTRES
        //###################################
        
        //AUTRES NOTES (SUPERIEUR A 40)
        listeHotelsParNote.forEach(function(hotelFromNoteToAdd){
            listePrio.add(hotelFromNoteToAdd)
        });

        //AUTRES DATES (INFERIEUR A 6 MOIS)
        listeHotelsParDatesVisitesPlusAnciennes.forEach(function(hotelFromDateToAdd){
            listePrio.add(hotelFromDateToAdd)
        });

        listePrio.forEach(function(valuetestprio) {
            console.log(" IDENTIFIANT : "+valuetestprio.id);
        });

        console.log(" SIZE : "+listePrio.size)
        return Array.from(listePrio)
        //return listeHotelsParDate

        // var nouvellevartestUn = this.prioriteSelonDate()
        // return nouvellevartestUn
    }

    creerVisites() {
        //tant qu'il reste des hotels a visiter et que < a ?

        //Visite.cre
        //ajouterDateVisite
        //ajouterHotel
        //ajouterVoiture
        //ajouterBinome

        sequelize.models.Visite.create({
            //num jour, num mois, num annee
            visited_at: new Date(2020,3,20),
            //heure debut
            time_start: moment(),
            //heure fin
            time_end: moment(),
            //idHotel
            hotel_id: 2,
            //idvoiture
            voiture_id: 2,
            //idbinome
            binome_id: 1,
            //idrapport
            rapport_id: 2
       })

       
       


       
        
    }
}


var visites = new Visites();
//this.visites.creerVisites();
//this.visites.prioriteSelonDerniereVisite()
module.exports=visites