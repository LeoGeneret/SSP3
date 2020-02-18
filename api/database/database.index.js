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

sequelize.authenticate({logging: false})
.then(() => {
  console.log("## DATABASE IS RUNNING")
})
.catch(err => {
  console.log("## DATABASE IS NOT RUNNING", err)
})

const Secteur = sequelize.import("./models/Secteur.js")
const Visiteur = sequelize.import("./models/Visiteur.js")
const Visite = sequelize.import("./models/Visite.js")
const Hotel = sequelize.import("./models/Hotel.js")
const Voiture = sequelize.import("./models/Voiture.js")
const Rapport = sequelize.import("./models/Rapport.js")
const VisiteurAbsence = sequelize.import("./models/VisiteurAbsence.js")
const Binome = sequelize.import("./models/Binome.js")
const User = sequelize.import("./models/User.js")

/**
 * Database relationship
 */

// // Visite <-> Hotel
Hotel.hasMany(Visite, { as: "hotel_visites", foreignKey: "hotel_id" })
Visite.belongsTo(Hotel, { as: "hotel", foreignKey: "hotel_id" })

// // Visite <-> Voiture
Voiture.hasMany(Visite, { as: "voiture_visites", foreignKey: "voiture_id" }) // @OPTI - useless?
Visite.belongsTo(Voiture, { as: "voiture", foreignKey: "voiture_id" })

// // Visite <-> Binome
Binome.hasMany(Visite, { as: "binome_visites", foreignKey: "binome_id" })
Visite.belongsTo(Binome, { as: "binome", foreignKey: "binome_id" })

// // Visite <-> Rapport
Rapport.hasOne(Visite, { as: "rapport_visites", foreignKey: "rapport_id" })
Visite.belongsTo(Rapport, { as: "rapport", foreignKey: "rapport_id" })

// Secteur <-> Visiteur
Secteur.hasMany(Visiteur, { as: "visiteur_secteur", foreignKey: "secteur_id" })
Visiteur.belongsTo(Secteur, { as: "visiteurs", foreignKey: "secteur_id" })


// Secteur <-> Hotel
Secteur.hasMany(Hotel, { as: "hotel_secteur", foreignKey: "secteur_id" })
Hotel.belongsTo(Secteur, { as: "hotels", foreignKey: "secteur_id" })

// Binome <-> Visiteur 1
Visiteur.hasMany(Binome, { as: "binome_1", foreignKey: "visiteur_id_1" })
Binome.belongsTo(Visiteur, { as: "visiteur_1", foreignKey: "visiteur_id_1" })

// Binome <-> Visiteur 2
Visiteur.hasMany(Binome, { as: "binome_2", foreignKey: "visiteur_id_2" })
Binome.belongsTo(Visiteur, { as: "visiteur_2", foreignKey: "visiteur_id_2" })

// Visiteur <-> VisiteurAbsence
Visiteur.hasMany(VisiteurAbsence, { as: "absences", foreignKey: "visiteur_id" })

// User <-> Visiteur
User.hasOne(Visiteur, {as: "visiteur", foreignKey: "user_id"})
Visiteur.belongsTo(User, {as: "user_related", foreignKey: "user_id"})



sequelize.models = {
  Secteur,
  Visiteur,
  Hotel,
  Voiture,
  Rapport,
  Visite,
  VisiteurAbsence,
  Binome,
  User,
}

module.exports = sequelize