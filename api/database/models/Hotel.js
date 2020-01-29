
module.exports = (sequelize, DataTypes) => {

    const Hotel = sequelize.define('hotel', {

        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        adresse: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        code_postal: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        ville: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        nombre_chambre: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        // status @WAIT

    }, {
        createdAt: false,
        updatedAt: false
    })

    return Hotel
}