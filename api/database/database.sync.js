
require("dotenv").config()

const sequelize = require("./database.index")


sequelize.sync({force: true}).then(() => {
    console.log("DATABASE HAS BEEN SYNCED")
    process.exit(0)
})