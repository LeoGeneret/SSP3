const sequelize = require("../database/database.index")
const moment = require('moment')
const Op = require('sequelize').Op

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




class Algo {
    
    //change name : to test
    async prioriteSelonNote(){


        let results = {
            error: false,
            status: 200,
            data: null
        }
        
        // PAR DATE
        var listeHotelsParDate = await sequelize.models.Hotel.findAll({


            order: [
                ["hotel_visites", "visited_at", "DESC"]    
            ],

            include: [
                {
                    association: "hotel_visites", 
                    required: true,
                    include: [{
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
            // console.log(" IDENTIFIANT : "+valuetestprio.id);
        });

        // console.log(" SIZE : "+listePrio.size)
        const listeHotelsFinal = Array.from(listePrio)

        const formattedListeHotel = listeHotelsFinal.map(Format.regularHotel)


        results.data = {
            pagination: {},
            list: listeHotelsFinal.map(Format.regularHotel)
        }

        return results
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


module.exports = new Algo()