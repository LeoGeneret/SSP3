
require("dotenv").config()

const sequelize = require("./database.index")

/**
 * HELPERS
 */
const moment = require('moment')
const faker = require('faker')
faker.locale = "fr"


const Helpers = {
    loop: (n, mapping) => Array(n).fill(true).map(mapping),
    randomSubArray: (array, n) => {
        let _array = [...array]

        if(n >= array.length) return array

        return Helpers.loop(n, () => {
            let randomIndex = faker.random.number(_array.length - 1)
            let randomItem = _array[randomIndex]
            _array.splice(randomIndex, 1)
            return randomItem
        })
    },
    randomFloat: (max, min = 0, decimals = 2) => Math.round( ((Math.random() * (max - min)) + min) * Math.pow(10, decimals) ) / Math.pow(10, decimals),
    fromMomentToDate: momentDate => new Date(momentDate.format("YYYY-MM-DDTHH:mm:ssZ"))
}

const {
    Hotel,
    Visiteur,
    Visite,
    Voiture
} = sequelize.models



const HOTEL_COUNT = 45
const VISITEUR_COUNT = 20
const VOITURE_COUNT = 10


const generate = async () => {

    const hotels = await Hotel.bulkCreate(Helpers.loop(HOTEL_COUNT, () => {

        const ville = faker.address.city()
        const code_postal = faker.address.zipCode()
        const adresse = faker.address.streetAddress()

        return {
            nom: "Hotel " + adresse,
            adresse: adresse,
            code_postal: code_postal,
            ville: ville,
        }
    }))


    console.log("#######")
    console.log("HAS GENERATED " + hotels.length + " hotels")
    console.log("#######")


    const visiteurs = await Visiteur.bulkCreate(Helpers.loop(VISITEUR_COUNT, () => {
        return {
            nom: faker.name.firstName() + " " + faker.name.lastName(),
            adresse: faker.address.streetAddress(),
            code_postal: faker.address.zipCode(),
            ville: faker.address.city(),
        }
    }))


    console.log("#######")
    console.log("HAS GENERATED " + visiteurs.length + " hotels")
    console.log("#######")


    const voitures = await Voiture.bulkCreate(Helpers.loop(VOITURE_COUNT, () => {
        return {
            immatriculation: faker.random.uuid(),
            type: "C3",
            adresse: faker.address.streetAddress(),
            code_postal: faker.address.zipCode(),
            ville: faker.address.city(),
        }
    }))


    console.log("#######")
    console.log("HAS GENERATED " + voitures.length + " voitures")
    console.log("#######")


    const binomes = Helpers.loop(Math.round(VISITEUR_COUNT * 1.5), () => Helpers.randomSubArray(visiteurs, 2))

    const visits = await Visite.bulkCreate(binomes.map(binomesItem => {
        
        let mustStartAt = moment().startOf("week")
        let visited_at = mustStartAt.clone().add(faker.random.number(4), "day")

        let startDay = visited_at.clone().hour(9)
        let time_start = startDay.clone().add(faker.random.number(9), "hour")
        let time_end = time_start.clone().add(faker.random.number(3), "hour")

        return {
            visiteur_id: binomesItem[0].get("id"),
            hotel_id: faker.random.arrayElement(hotels).get("id"),
            voiture_id: faker.random.arrayElement(voitures).get("id"),
            rapport: {
                note: faker.random.number(100),
                commentaire: Math.random() > .5 ? null : faker.lorem.sentences(2)
            },
            visited_at: visited_at,
            time_start: time_start,
            time_end: time_end,
        }
    }), {
        include: [
            {
                association: "rapport"
            }
        ]
    })

    console.log("#######")
    console.log("HAS GENERATED " + visits.length + " visits")
    console.log("#######")
}


// sequelize.sync({force: true}).then(() => {
//     generate().then(() => {
//         console.log("DATABASE HAS BEEN SEEDED")
//         process.exit(0)
//     })
// })

generate().then(() => {
    console.log("DATABASE HAS BEEN SEEDED")
    process.exit(0)
})