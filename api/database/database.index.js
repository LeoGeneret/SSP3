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
    logging: console.log,
  } 
)

sequelize.authenticate().then(() => {
  console.log({DATABASE: true})
})

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

// Visite <-> Hotel
Hotel.hasMany(Visite, {as: "hotel_visites", foreignKey: "hotel_id"})
Visite.belongsTo(Hotel, {as: "hotel", foreignKey: "hotel_id"})

// Visite <-> Voiture
Voiture.hasMany(Visite, {as: "voiture_visites", foreignKey: "voiture_id"}) // @OPTI - useless?
Visite.belongsTo(Voiture, {as: "voiture", foreignKey: "voiture_id"})

// Visite <-> Binome
Binome.hasMany(Visite, {as: "binome_visites", foreignKey: "binome_id"})
Visite.belongsTo(Binome, {as: "binome", foreignKey: "binome_id"})

// Visite <-> Rapport
Rapport.hasOne(Visite, {as: "rapport_visite", foreignKey: "rapport_id"})
Visite.belongsTo(Rapport, {as: "rapport", foreignKey: "rapport_id"})

// Secteur <-> Visiteur
Secteur.hasMany(Visiteur, {as: "visiteur_secteur", foreignKey: "secteur_id"})

// Secteur <-> Hotel
Secteur.hasMany(Hotel, {as: "hotel_secteur", foreignKey: "secteur_id"})


// Binome <-> Visiteur 1
Visiteur.hasMany(Binome, {as: "visiteur_1", foreignKey: "visiteur_id_1"})
Binome.belongsTo(Visiteur, {as: "visiteur_1", foreignKey: "visiteur_id_1"})

// Binome <-> Visiteur 2
Visiteur.hasMany(Binome, {as: "visiteur_2", foreignKey: "visiteur_id_2"})
Binome.belongsTo(Visiteur, {as: "visiteur_2", foreignKey: "visiteur_id_2"})


// Visiteur <-> VisiteurAbsence
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