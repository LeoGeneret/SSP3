
module.exports = (sequelize, DataTypes) => {

    const Rapport = sequelize.define('rapport', {

        note: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        commentaire: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

    }, {
        createdAt: false,
        updatedAt: false
    })

    return Rapport
}