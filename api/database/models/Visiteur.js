
module.exports = (sequelize, DataTypes) => {

    const Visiteur = sequelize.define('visiteur', {

        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        adresse: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        ville: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        code_postal: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    }, {
        createdAt: false,
        updatedAt: false
    })

    return Visiteur
}