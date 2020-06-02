
// Libs
import React, { useState } from 'react'
import Proptypes from 'prop-types'
import {useHistory, useParams} from 'react-router-dom'

// Shared
import FormRessource from "../shared/FormRessource";

// Utils
import fetcher from '../utils/fetcher'
import utils from '../utils'

// icons
import IconAgent from '../icons/icon-agent'

function PageFormAgent(props){

    const history = useHistory()
    const routeParams = useParams()

    // States
    const [stateFormData, setStateFormData] = useState({
        nom: "",
        adresse: "",
        ville: "",
        code_postal: "",
        secteur_id: ""
    })
    const [secteurOptions, setSecteurOptions] = React.useState([])

    // Methods
    const handleChange = (name, value) => {

        setStateFormData({
            ...stateFormData,
            [name]: value
        })
    }

    const onCreateAgent = event => {
        event.preventDefault()

        utils.fetchReadyData('/visiteur/create', {
            method: 'PUT',
            body: JSON.stringify(stateFormData),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {

            if(res.error){
                // show snackbar error
            } else {
                // show snackbar success
                history.push("/agents")
            }
        })
    }

    const onEditAgent = event => {
        event.preventDefault()

        const visiteurId = routeParams.id

        utils
        .fetchReadyData(`/visiteur/${visiteurId}/update`, {
          method: 'PATCH',
          body: JSON.stringify(stateFormData),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
          if (res.error) {
              console.error(res.error)
          } else {
            history.push("/agents")
            }
        })
    }

    const onCancel = event => {
        console.log("has cancelled")
    }

    // didMount

    React.useEffect(() => {

        const visiteurId = routeParams.id

        if(props.editMode && visiteurId){
            utils.fetchReadyData('/visiteur/' + visiteurId).then(response => {
                if (response.error) {
                  console.log(response.error)
                } else {
                  setStateFormData({
                      ...stateFormData,
                      ...response.data,
                  })
                }
            })
        }

        fetcher.getSecteurs()
        .then(res => {

            if(!res.error){
                setSecteurOptions(res.data)
            }

        })

    }, [])

    return (
        <FormRessource
            headingIcon={<IconAgent/>}
            headingTitle="Créer un agent"
            handleChange={handleChange}
            onSubmit={props.editMode ? onEditAgent : onCreateAgent}
            onCancel={onCancel}
            formData={[
                {form_value: stateFormData.nom, form_name: "nom", inputType: "text", label: "Nom/Prénom", placeholder: "Joseph Leon"},
                {form_value: stateFormData.adresse, form_name: "adresse", inputType: "text", label: "Adresse", placeholder: "5 rue du marigoy"},
                {form_value: stateFormData.code_postal, form_name: "code_postal", inputType: "text", label: "Code postal", placeholder: "75002"},
                {form_value: stateFormData.ville, form_name: "ville", inputType: "text", label: "Ville", placeholder: "Paris"},
                {form_value: stateFormData.secteur_id, form_name: "secteur_id", inputType: "select", label: "Secteur", placeholder: "Secteur de travail",
                    selectOptions: secteurOptions.map(s => ({
                        id: s.id,
                        label: s.label,
                        value: s.id,
                    }))
                },
            ]}
        />
    )
}

PageFormAgent.propTypes = {
    editMode: Proptypes.bool
}

export default PageFormAgent