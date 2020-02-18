const sequelize = require('../database/database.index')

const listeHotels = sequelize.models.Hotel.findAll({});
const listeVisiteurs = sequelize.models.Visiteur.findAll({});



hotel.get('nom')


class Planning {


    constructor(){
        this.binome = new Binome();
        this.visite = new Visite();
    }

    genererPlanning() {
        this.createBinomes();
        this.createVisites();

    }

    createBinomes(){
        this.binome.create();

    }

    createVisites(){
        this.visite.create();
    }



}