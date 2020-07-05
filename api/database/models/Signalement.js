const MOTIFS = [
    "Problème de santé",
    "Problème de transport",
    "Véhicule indisponible",
]

module.exports = (sequelize, DataTypes) => {

    const Signalement = sequelize.define('signalement', {

        commentaire: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        motif: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        notified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    
    }, {
        createdAt: "created_at",
        updatedAt: false
    })

    Signalement.getAll = async function(){

        let results = {
            error: false,
            status: 200,
            data: null
        }

        try{

            let signalements = null

            signalements = await Signalement.findAll({
                order: [
                    ["created_at", "DESC"]
                ],
                include: [
                    {
                        association: "visit",
                        include: [
                            {
                                association: "hotel"
                            }
                        ]
                    },
                    {
                        association: "reported_by"
                    }
                ],
                // where: {
                //     notified: false
                // }
            })

            results.data = signalements

        } catch (GetAllSignalement) {
            console.error({ GetAllSignalement })
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on fetching ressources"
            }
            results.status = 502
        }

        return results
    }

    Signalement.createSignalement = async function(motif, visit_id, visiteur_id, commentaire = null){

        let results = {
            error: false,
            status: 200,
            data: null
        }

        try {

            let relatedVisit = await sequelize.models.Visite.findByPk(visit_id)
            let relatedVisiteur = await sequelize.models.Visiteur.findByPk(visiteur_id)

            // visit not found
            if(!relatedVisit || !relatedVisiteur){
                results.error = {
                    code: 404,
                    message: "NOT FOUND - visit or visiteur not found"
                }
                results.status = 404
            } else {
                let signalement = await Signalement.create({
                    motif: motif,
                    visit_id: visit_id,
                    visiteur_id: visiteur_id,
                    commentaire: commentaire,
                })

                // set related visit as canceled
                await relatedVisit.setDataValue("is_canceled", true)
                await relatedVisit.save()
    
                results.data = signalement
            }

        } catch (GetAllSignalement) {
            console.error({ GetAllSignalement })
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on fetching ressources"
            }
            results.status = 502
        }

        return results
    }

    Signalement.notifySignalement = async function(signalement_id){

        let results = {
            error: false,
            status: 200,
            data: null
        }

        try {

            let relatedSignalement = await Signalement.findByPk(signalement_id)

            // visit not found
            if(!relatedSignalement){
                results.error = {
                    code: 404,
                    message: "NOT FOUND - signalement not found"
                }
                results.status = 404
            } else {


                // set related visit as canceled
                await relatedSignalement.setDataValue("notified", true)
                await relatedSignalement.save()
    
                results.data = relatedSignalement
            }

        } catch (NotifySignalementError) {
            console.error({ NotifySignalementError })
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on fetching ressources"
            }
            results.status = 502
        }

        return results
    }

    return Signalement
}