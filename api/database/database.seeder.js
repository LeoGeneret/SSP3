
require("dotenv").config()

const sequelize = require("./database.index")

/**
 * HELPERS
 */
const moment = require('moment')
const bcrypt = require("bcrypt")
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
    Voiture,
    VisiteurAbsence,
    Secteur,
    User
} = sequelize.models



const HOTEL_COUNT = 200
const VISITEUR_COUNT = 20
const VOITURE_COUNT = 10
const SECTEUR_COUNT = 5
const SECTEUR_LIST = ['75', '93', '92-94', '77-91', '78-95']


const generate = async () => {

    const secteurs = await Secteur.bulkCreate(SECTEUR_LIST.map((secteur_intem) => {
        return {
            label: secteur_intem,
        }
    }))

    console.log("#######")
    console.log("HAS GENERATED " + secteurs.length + " secteurs")
    console.log("#######")

    const hotels = await Hotel.bulkCreate(Helpers.loop(HOTEL_COUNT, () => {

        const ville = faker.address.city()
        const code_postal = faker.address.zipCode()
        const adresse = faker.address.streetAddress()

        return {
            nom: "Hotel " + adresse,
            adresse: adresse,
            code_postal: code_postal,
            ville: ville,
            nombre_chambre : faker.random.number(122),
            secteur_id : faker.random.arrayElement(secteurs).get("id"),
            priority: Math.random() > .95 ? true : false
        }
    }))


    console.log("#######")
    console.log("HAS GENERATED " + hotels.length + " hotels")
    console.log("#######")


    const users = await User.bulkCreate(Helpers.loop(VISITEUR_COUNT, () => {
        return {
            email: faker.internet.email(),
            // must use async in production
            password: bcrypt.hashSync("1234", 10),
            role: "visitor"
        }
    }))

    // generate one planner
    const userPlanner = await User.create({
        email: "planner@spp3.email",
        password: bcrypt.hashSync("0000", 10),
        role: "planner"
    })

    console.log("#######")
    console.log("HAS GENERATED " + users.length + " users")
    console.log("#######")

    const visiteurs = await Visiteur.bulkCreate(users.map(usersItem => {
        return {
            nom: faker.name.firstName() + " " + faker.name.lastName(),
            adresse: faker.address.streetAddress(),
            code_postal: faker.address.zipCode(),
            ville: faker.address.city(),
            secteur_id : faker.random.arrayElement(secteurs).get("id"),
            user_id: usersItem.get("id"),
        }
    }))


    console.log("#######")
    console.log("HAS GENERATED " + visiteurs.length + " visiteurs")
    console.log("#######")

    const visiteursAbsences = await visiteurs.map(visiteursItem => {

        let absencesCount = faker.random.number(2)
        const lesRaisons = ["congé maladie", "congé payé", "en formation"]

        return VisiteurAbsence.bulkCreate(Helpers.loop(absencesCount, () => {

            let date_start = moment().startOf("week").add(faker.random.number(4), "day")
            let date_end = date_start.clone().add(faker.random.number(1), "day").endOf("day")


            return {
                date_start: date_start,
                date_end: date_end,
                raison: faker.random.arrayElement(lesRaisons),
                visiteur_id: visiteursItem.get("id"),
            }
        }))
    })


    console.log("#######")
    console.log("HAS GENERATED " + visiteursAbsences.length + " visiteursAbsences")
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


    const generated_binomes = Helpers.loop(Math.round(VISITEUR_COUNT * 1.5), () => Helpers.randomSubArray(visiteurs, 2))
    const binomes = generated_binomes.map(binomesItem => {
        return {
            visiteur_id_1: binomesItem[0].get("id"),
            visiteur_id_2: binomesItem[1].get("id")
        }
    })

    console.log("#######")
    console.log("HAS GENERATED " + binomes.length + "binomes")
    console.log("#######")

    let visits = binomes.map(binomesItem => {
            
        return Visite.bulkCreate(Helpers.loop(10, () => {
    
            let visited_at = moment()
                .add(-4 + faker.random.number(30 * 24) * -1, "day")
                .add(faker.random.number(4), "day")
    
            let time_start = visited_at.clone().hour(9).add(faker.random.number(9), "hour")
            let time_end = time_start.clone().add(faker.random.number(3), "hour")
    
            return {
                visiteur_id_1: binomesItem.visiteur_id_1,
                visiteur_id_2: binomesItem.visiteur_id_2,
                hotel_id: faker.random.arrayElement(hotels).get("id"),
                voiture_id: faker.random.arrayElement(voitures).get("id"),
                rapport: {
                    note: faker.random.number(60),
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
    })

    await Promise.all(visits)

    console.log("#######")
    console.log("HAS GENERATED " + visits.length + " visits")
    console.log("#######")
}


sequelize.sync({force: true}).then(() => {
    generate().then(() => {
        console.log("DATABASE HAS BEEN SEEDED")
        process.exit(0)
    })
})

// generate().then(() => {
//     console.log("DATABASE HAS BEEN SEEDED")
//     process.exit(0)
// })