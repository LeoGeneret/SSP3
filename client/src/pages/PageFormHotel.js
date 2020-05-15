
// Libs
import Proptypes from 'prop-types'
import React, { useState } from 'react'
import {useHistory, useParams} from 'react-router-dom'

// Shared
import FormRessource from "../shared/FormRessource";

// Utils
import fetcher from '../utils/fetcher'
import utils from '../utils'

// icons
import IconHotel from '../icons/icon-hotel'

function PageFormHotel(props){

    const history = useHistory()
    const routeParams = useParams()

    // States
    const [stateFormData, setStateFormData] = useState({
        nom: "",
        adresse: "",
        ville: "",
        code_postal: "",
        secteur_id: "",
        nombre_chambre: 0,
    })
    const [secteurOptions, setSecteurOptions] = React.useState([])

    // Methods
    const handleChange = (name, value) => {

        setStateFormData({
            ...stateFormData,
            [name]: value
        })
    }

    const onCreateHotel = event => {
        event.preventDefault()

        utils.fetchReadyData('/hotel/create', {
          method: 'PUT',
          body: JSON.stringify(stateFormData),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {

            if(res.error){
                // show snackbar error
            } else {
                // show snackbar success
                history.push("/")
            }
        })
    }

    const onEditHotel = event => {
        event.preventDefault()

        const hotelId = routeParams.id

        utils
        .fetchReadyData(`/hotel/${hotelId}/update`, {
          method: 'PATCH',
          body: JSON.stringify(stateFormData),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
          if (res.error) {
              console.error(res.error)
          } else {
            history.push("/")
            }
        })
    }

    const onCancel = event => {
        console.log("has cancelled")
    }

    // Lifecylcle

    React.useEffect(() => {

        const hotelId = routeParams.id

        // Get hotel data if editMode
        if(props.editMode && hotelId){
            utils.fetchReadyData('/hotel/' + hotelId).then(response => {
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
            headingIcon={<IconHotel/>}
            headingTitle="Créer un hotel"
            handleChange={handleChange}
            onSubmit={props.editMode ? onEditHotel : onCreateHotel}
            onCancel={onCancel}
            formData={[
                {form_value: stateFormData.nom, form_name: "nom", inputType: "text", label: "Nom/Prénom", placeholder: "Joseph Leon"},
                {form_value: stateFormData.adresse, form_name: "adresse", inputType: "text", label: "Adresse", placeholder: "5 rue du marigoy"},
                {form_value: stateFormData.code_postal, form_name: "code_postal", inputType: "text", label: "Code postal", placeholder: "75002"},
                {form_value: stateFormData.ville, form_name: "ville", inputType: "text", label: "Ville", placeholder: "Paris"},
                {form_value: stateFormData.secteur_id, form_name: "secteur_id", inputType: "select", label: "Secteur", placeholder: "Secteur de travail",
                    selectOptions: utils.formatSelectSecteur(secteurOptions)
                },
                {form_value: stateFormData.nombre_chambre, form_name: "nombre_chambre", inputType: "number", label: "Nombre de chambres", placeholder: "2 chambres"},
            ]}
        />
    )
}

PageFormHotel.propTypes = {
    editMode: Proptypes.bool
}

export default PageFormHotel