
module.exports = (sequelize, DataTypes) => {

    const VisiteurVisite = sequelize.define('visiteur_visite', {
        
        visiteur_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "visiteurs",
                key: "id",
            }
        },

        visite_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "visites",
                key: "id",
            }
        },

    }, {
        createdAt: false,
        updatedAt: false
    })

    return VisiteurVisite
}