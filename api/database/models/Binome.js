
module.exports = (sequelize, DataTypes) => {

    const Binome = sequelize.define('binome', {
        
    }, {
        createdAt: false,
        updatedAt: false
    })

    return Binome
}