
require("dotenv").config()

const sequelize = require("./database.index")
const params = require("../api.params")

/**
 * HELPERS
 */
const moment = require('moment')
const bcrypt = require("bcryptjs")
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
    // Voiture,
    VisiteurVisite,
    Secteur,
    User
} = sequelize.models


const HOTEL_COUNT = 200
// const VOITURE_COUNT = 10
const SECTEUR_COUNT = 5
const SECTEUR_LIST = ['75', '93', '92-94', '77-91', '78-95']
const VISITEUR_COUNT = (2 * SECTEUR_LIST.length) * 2
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
            priority: Math.random() > .9 ? true : false
        }
    }))


    console.log("#######")
    console.log("HAS GENERATED " + hotels.length + " hotels")
    console.log("#######")


    const usersWithNoms = Helpers.loop(VISITEUR_COUNT, () => {
        return {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
        }
    })

    usersWithNoms[0] = {
        firstName: "Jean",
        lastName: "François",
        email: "jean.françois@monemail.com"
    }

    const users = await User.bulkCreate(usersWithNoms.map(u => {
        return {
            email: u.email || faker.internet.email(u.firstName, u.lastName),
            // must use async in production
            password: bcrypt.hashSync("1234", 10),
            role: params.USER_ROLE_VISITOR
        }
    }))

    // generate one planner
    const userPlanner = await User.create({
        email: "planner@ssp3.email",
        password: bcrypt.hashSync("0000", 10),
        role: params.USER_ROLE_PLANNER
    })

    console.log("#######")
    console.log("HAS GENERATED " + users.length + " users")
    console.log("#######")

    const visiteurs = await Visiteur.bulkCreate(users.map((usersItem, index) => {
        return {
            nom: usersWithNoms[index].firstName + " " + usersWithNoms[index].lastName,
            adresse: faker.address.streetAddress(),
            code_postal: faker.address.zipCode(),
            ville: faker.address.city(),
            secteur_id : secteurs[index % secteurs.length].get("id"),
            user_id: usersItem.get("id"),
        }
    }))


    console.log("#######")
    console.log("HAS GENERATED " + visiteurs.length + " visiteurs")
    console.log("#######")

    // unused
    // const visiteursAbsences = await visiteurs.map(visiteursItem => {

    //     let absencesCount = faker.random.number(2)
    //     const lesRaisons = ["congé maladie", "congé payé", "en formation"]

    //     return VisiteurAbsence.bulkCreate(Helpers.loop(absencesCount, () => {

    //         let date_start = moment().startOf("week").add(faker.random.number(4), "day")
    //         let date_end = date_start.clone().add(faker.random.number(1), "day").endOf("day")


    //         return {
    //             date_start: date_start,
    //             date_end: date_end,
    //             raison: faker.random.arrayElement(lesRaisons),
    //             visiteur_id: visiteursItem.get("id"),
    //         }
    //     }))
    // })


    // console.log("#######")
    // console.log("HAS GENERATED " + visiteursAbsences.length + " visiteursAbsences")
    // console.log("#######")


    // UNUSED
    // const voitures = await Voiture.bulkCreate(Helpers.loop(VOITURE_COUNT, () => {
    //     return {
    //         immatriculation: faker.random.uuid(),
    //         type: "C3",
    //         adresse: faker.address.streetAddress(),
    //         code_postal: faker.address.zipCode(),
    //         ville: faker.address.city(),
    //     }
    // }))


    // console.log("#######")
    // console.log("HAS GENERATED " + voitures.length + " voitures")
    // console.log("#######")


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
            
        return Visite.bulkCreate(Helpers.loop(100, () => {
    
            let visited_at = moment()
                .add(-faker.random.number(365) - 30 * 4, "day")
                .add(faker.random.number(4), "day")

            let time_start = visited_at.clone().hour(9).add(faker.random.number(9), "hour")
            let time_end = time_start.clone().add(faker.random.number(3), "hour")
    
            return {
                hotel_id: faker.random.arrayElement(hotels).get("id"),
                // voiture_id: faker.random.arrayElement(voitures).get("id"),
                rapport: {
                    note: faker.random.number(60),
                    commentaire: Math.random() > .5 ? null : faker.lorem.sentences(2)
                },
                time_start: time_start,
                time_end: time_end,
                is_canceled: Math.random() > .95 ? true : false
            }
        }), {
            include: [
                {
                    association: "rapport"
                }
            ]
        })
        .then(createdVisits => {

            return Promise.all(
                createdVisits.map(createdVisitsItem => {

                    return VisiteurVisite.bulkCreate([
                        {visiteur_id: binomesItem.visiteur_id_1, visite_id: createdVisitsItem.get("id")},
                        {visiteur_id: binomesItem.visiteur_id_2, visite_id: createdVisitsItem.get("id")},

                    ])
                })
            )
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