
module.exports = (sequelize, DataTypes) => {

    const Secteur = sequelize.define('secteur', {
        
        intitule_secteur: {
            type: DataTypes.STRING,
            allowNull: false,
        },



    }, {
        createdAt: false,
        updatedAt: false
    })

    return Secteur
}