
module.exports = (sequelize, DataTypes) => {

    const Secteur = sequelize.define('secteur', {
        
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },

    }, {
        createdAt: false,
        updatedAt: false
    })

    Secteur.getAll = async () => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        let secteurs = null

        try {
            secteurs = await Secteur.findAll()

            if(secteurs){
                results.data = secteurs
            }

        } catch (GetAllSecteurError) {
            console.error({GetAllSecteurError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on fetching ressources"
            }
            results.status = 502
        }

        return results
    }

    Secteur.createSecteur = async (fields) => {
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let secteur = null

        if(Object.values(fields).some(fieldsItem => fieldsItem === undefined || fieldsItem === null || fieldsItem === "")){
            results.error = {
                code: 400,
                message: "BAD REQUEST - one param is null" + JSON.stringify(fields)
            }
            results.status = 400
        } else {
            try {
                secteur = await Secteur.create(fields)
                if(secteur){
                    results.data = secteur
                    results.status = 201
                }
            } catch (CreateSecteurError) {
                console.error({CreateSecteurError})
                results.error = {
                    code: 502,
                    message: "BAD GATEWAY - error on creating ressource"
                }
                results.status = 502
            }
        }
        return results
    }

    return Secteur
}