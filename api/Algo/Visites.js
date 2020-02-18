require("dotenv").config()

//const sequelize = require('../api.routes')
const sequelize = require("../database/database.index")
const moment = require('moment')

//const listeHotels = sequelize.models.Visite.findAll({});


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

    async prioriteSelonNote(){
        var listeHotelsSelonNote = await sequelize.models.Hotel.findAll({
            order: [
                [{association: "hotel_visites"},"rapport_id", "ASC"]
            ],
            include: [{
                association: "hotel_visites"
            }]
        })
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