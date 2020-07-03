
module.exports = (sequelize, DataTypes) => {

    const RapportImage = sequelize.define('rapportImage', {

        src: {
            type: DataTypes.STRING,
            allowNull: false,
        }

    }, {
        createdAt: false,
        updatedAt: false
    })

    RapportImage.getAll = async (attributes = undefined, rapport_id) => {

        let results = {
            error: false,
            status: 200,
            data: null
        }

        if(attributes){
            attributes = attributes.split(",")
        }

        let rapportImages = null

        try {
            rapportImages = await sequelize.query("select distinct * from rapport_images where rapport_images.rapport_id = $rapport_id", {bind: { rapport_id }});
    
            if(rapportImages){
                console.log(rapportImages[0])
            }

        } catch (GetAllRapportImageError) {
            console.error({GetAllRapportImageError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on fetching ressources",
                extra_message: attributes ? ("you specified attributes=" + attributes.toString()) : undefined
            }
            results.status = 502
        }
        return results
    }

    RapportImage.createRapportImage = async (fields) => {
        let results = {
            error: false,
            status: 200,
            data: null
        }

        let rapportImage = null
        const srcContent = fields.src
        const rapport_id = fields.rapport_id

        if(Object.values(fields).some(fieldsItem => fieldsItem === undefined || fieldsItem === null || fieldsItem === "")){
            results.error = {
                code: 400,
                message: "BAD REQUEST - one param is null" + JSON.stringify(fields)
            }
            results.status = 400
        } else {
            try {
                rapportImage = await sequelize.query("insert into rapport_images (src, rapport_id) values ($srcContent, $rapport_id)", {bind: { srcContent, rapport_id }})
                if(rapportImage){
                    results.data = rapportImage
                    results.status = 201
                }
            } catch (CreateRapportError) {
                console.error({CreateRapportError})
                results.error = {
                    code: 502,
                    message: "BAD GATEWAY - error on creating ressource"
                }
                results.status = 502
            }
        }
        return results
    }

    RapportImage.updateRapportImage = async (rapportImageId, rapportImageInfo) => {
        let results = {
            error: false,
            status: 200,
            data: null
        }

        // let rapportImage = null
        let nextRapportImage = {...rapportImageInfo}
        const rapportImgId = rapportImageId
        const srcContent = rapportImageInfo.src
        const rapport_id = rapportImageInfo.rapport_id
                
        // Remove undifined keys


        if(Object.values(rapportImageInfo).some(rapportImageInfoItem => rapportImageInfoItem === undefined || rapportImageInfoItem === null || rapportImageInfoItem === "")){
            results.error = {
                code: 400,
                message: "BAD REQUEST - one param is null" + JSON.stringify(rapportImageInfo)
            }
            results.status = 400
        } else {
            try {
                rapportImage = await sequelize.query("update rapport_images set src=$srcContent, rapport_id=$rapport_id where id=$rapportImgId", {bind: { srcContent, rapport_id, rapportImgId }})
                if(rapportImage){
                    results.data = rapportImage
                    results.status = 201
                }
            } catch (CreateRapportError) {
                console.error({CreateRapportError})
                results.error = {
                    code: 502,
                    message: "BAD GATEWAY - error on creating ressource"
                }
                results.status = 502
            }
        }



        // Object.keys(nextRapportImage).forEach(key => (nextRapportImage[key] === null || nextRapportImage[key] === "" || nextRapportImage[key] === undefined) && delete nextRapportImage[key])
        
        // try {
        //     [rapportModifiedCount,] = await sequelize.query("update rapport_images set src=$srcContent, rapport_id=$rapport_id where id=$rapportImgId", {bind: { srcContent, rapport_id, rapportImgId }})

        //     if(rapportModifiedCount === 1){
        //         // results.data = await RapportImage.findByPk(rapportImageId)
        //     } else {
        //         results.error = {
        //             code: 404,
        //             message: "NOT FOUND - no rapport image found"
        //         }
        //         results.status = 404
        //     }
        // } catch (UpdateRapportError) {
        //     console.error({UpdateRapportError})
        //     results.error = {
        //         code: 502,
        //         message: "BAD GATEWAY - error on updating ressource"
        //     }
        //     results.status = 502
        // }
        
        return results
    }

    RapportImage.deleteRapportImage = async (rapportImageId = null) => {
        
        if(rapportImageId === null) {
            return {
                error:{
                    message: "BAD REQUEST - you must specify rapportImageId",
                    code: 400
                },
                data: null,
                status: 400
            }
        }

        let results = {
            error: false,
            status: 200,
            data: null
        }

        let rapport = null
        const rapportImgId = rapportImageId

        try {
            rapport = await sequelize.query("delete from rapport_images where id=$rapportImgId", {bind: { rapportImgId }})
            if(rapport === 0){
                results.error = {
                    code: 404,
                    message: "NOT FOUND - no rapport found"
                }
                results.status = 404
            } else {
                results.status = 202
                results.data = "deleted"
            }
        } catch (DeleteRapportError) {
            console.error({DeleteRapportError})
            results.error = {
                code: 502,
                message: "BAD GATEWAY - error on deleting ressource"
            }
            results.status = 502
        }

        return results
    }

    return RapportImage
}