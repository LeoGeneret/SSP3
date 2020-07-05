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
// const Voiture = sequelize.import("./models/Voiture.js")
const Rapport = sequelize.import("./models/Rapport.js")
// unused
// const VisiteurAbsence = sequelize.import("./models/VisiteurAbsence.js")
const User = sequelize.import("./models/User.js")
const VisiteurVisite = sequelize.import("./models/VisiteurVisite.js")

/**
 * Database relationship
 */

// // Visite <-> Hotel
Hotel.hasMany(Visite, { as: "hotel_visites", foreignKey: "hotel_id", onDelete: "CASCADE"})
Visite.belongsTo(Hotel, { as: "hotel", foreignKey: "hotel_id" })

// // Visite <-> Voiture
// Voiture.hasMany(Visite, { as: "voiture_visites", foreignKey: "voiture_id" }) // @OPTI - useless?
// Visite.belongsTo(Voiture, { as: "voiture", foreignKey: "voiture_id" })

// // Visite <-> Visiteurs
Visite.belongsToMany(Visiteur, { through: VisiteurVisite, as: "visiteurs", foreignKey: "visite_id"})
Visiteur.belongsToMany(Visite, { through: VisiteurVisite, as: "visites", foreignKey: "visiteur_id"})

// // Visite <-> Rapport
Rapport.hasOne(Visite, { as: "rapport_visites", foreignKey: "rapport_id" })
Visite.belongsTo(Rapport, { as: "rapport", foreignKey: "rapport_id" })

// Secteur <-> Visiteur
Secteur.hasMany(Visiteur, { as: "visiteurs", foreignKey: "secteur_id" })
Visiteur.belongsTo(Secteur, { as: "secteur", foreignKey: "secteur_id" })


// Secteur <-> Hotel
Secteur.hasMany(Hotel, { as: "hotels_related", foreignKey: "secteur_id" })
Hotel.belongsTo(Secteur, { as: "secteur", foreignKey: "secteur_id" })

// unused
// Visiteur <-> VisiteurAbsence
// Visiteur.hasMany(VisiteurAbsence, { as: "absences", foreignKey: "visiteur_id" })

// User <-> Visiteur
User.hasOne(Visiteur, {as: "visiteur", foreignKey: "user_id"})
Visiteur.belongsTo(User, {as: "user_related", foreignKey: "user_id"})



sequelize.models = {
  Secteur,
  Visiteur,
  Hotel,
  // Voiture,
  Rapport,
  Visite,
  // unused
  // VisiteurAbsence,
  User,
  VisiteurVisite,
}

module.exports = sequelize