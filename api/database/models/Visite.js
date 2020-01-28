
module.exports = (sequelize, DataTypes) => {

    const Visite = sequelize.define('visite', {
        
        visited_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        time_start: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        time_end: {
            type: DataTypes.DATE,
            allowNull: false,
        },

    }, {
        createdAt: false,
        updatedAt: false
    })

    return Visite
}