
module.exports = (sequelize, DataTypes) => {

    const Voiture = sequelize.define('voiture', {

        immatriculation: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        type: {
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
    
        // status @WAIT

    }, {
        createdAt: false,
        updatedAt: false
    })

    // Refaire
    // Voiture.getAll = async () => {
    //     return Voiture.findAll({
    //         attributes: ["id", "type", "immatriculation"]
    //     })
    // }

    return Voiture
}