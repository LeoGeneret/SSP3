/**
 * SEQUELIZE
 */
const Sequelize = require('sequelize')
const sequelize = new Sequelize(
  
  process.env.DB_NAME, 

  process.env.DB_USER, 

  process.env.DB_PASSWORD, 

  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: /*console.log*/false,
  } 
)


const Hotel = sequelize.import("./models/Hotel.js"),
      Voiture = sequelize.import("./models/Voiture.js"),
      Rapport = sequelize.import("./models/Rapport.js"),
      Visiteur = sequelize.import("./models/Visiteur.js"),
      VisiteurAbsence = sequelize.import("./models/VisiteurAbsence.js"),
      Visite = sequelize.import("./models/Visite.js"),
      Binome = sequelize.import("./models/Binome.js"),
      Secteur = sequelize.import("./models/Secteur.js")

/**
 * Database relationship
 */

// Visit's Hotel
Hotel.hasMany(Visite, {as: "hotels", foreignKey: "hotel_id"})

// Visit's Voiture
Voiture.hasMany(Visite, {as: "voiture", foreignKey: "voiture_id"})

// Binome's Visit
Binome.hasMany(Visite, {as: "binome", foreignKey: "binome_id"})

// Visiteur's Secteur
Secteur.hasMany(Visiteur, {as: "visiteur_secteur", foreignKey: "secteur_id"})

// Hotel's Secteur
Secteur.hasMany(Hotel, {as: "hotel_secteur", foreignKey: "secteur_id"})





// Visiteur's Binome
Visiteur.hasMany(Binome, {as: "visiteur1", foreignKey: "visiteur_id_1"})
Visiteur.hasMany(Binome, {as: "visiteur2", foreignKey: "visiteur_id_2"})



// Visit's Rapport  @OPTI = est-ce nécessaire ?
Rapport.hasOne(Visite, {as: "rapport", foreignKey: "rapport_id"})
Visite.belongsTo(Rapport, {as: "rapport", foreignKey: "rapport_id"})

Visiteur.hasMany(VisiteurAbsence, {as: "absences", foreignKey: "visiteur_id"})


sequelize.models = {
  Hotel,
  Voiture,
  Rapport,
  Visite,
  Visiteur,
  VisiteurAbsence,
  Binome,
  Secteur,
}
  
module.exports = sequelize