
module.exports = (sequelize, DataTypes) => {

    const VisiteurAbsence = sequelize.define('visiteur_absence', {

        date_start: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        date_end: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        raison: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    }, {
        createdAt: false,
        updatedAt: false
    })

    return VisiteurAbsence
}