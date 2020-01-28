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


const Hotel = sequelize.import("./models/Hotel.js"),
      Voiture = sequelize.import("./models/Voiture.js"),
      Rapport = sequelize.import("./models/Rapport.js"),
      Visiteur = sequelize.import("./models/Visiteur.js"),
      Visite = sequelize.import("./models/Visite.js")


/**
 * Database relationship
 */

// Visit's Hotel
Hotel.hasMany(Visite, {as: "hotels", foreignKey: "hotel_id"})

// Visit's Voiture
Voiture.hasMany(Visite, {as: "voiture", foreignKey: "voiture_id"})

// Visit's Visiteur
Visiteur.hasMany(Visite, {as: "visiteur", foreignKey: "visiteur_id"})

// Visit's Rapport  @OPTI = est-ce nécessaire ?
Rapport.hasOne(Visite, {as: "rapport", foreignKey: "rapport_id"})
Visite.belongsTo(Rapport, {as: "rapport", foreignKey: "rapport_id"})


sequelize.models = {
  Hotel,
  Voiture,
  Rapport,
  Visite,
  Visiteur,
}
  
module.exports = sequelize