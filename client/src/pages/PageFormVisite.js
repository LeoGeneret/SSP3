
// Libs
import React, { useState } from 'react'
import {useHistory} from 'react-router-dom'
import moment from "moment"

// Shared
import FormRessource from "../shared/FormRessource";

// Utils
import utils from '../utils'

// icons
import IconCalendar from "../icons/icon-calendar"

function PageFormHotel(props){

    const history = useHistory()

    // States
    const [stateFormData, setStateFormData] = useState({
        visited_at: "",
        time_start: "",
        time_end: "",
        hotel_id: "",
        visiteur_id_1: "",
        visiteur_id_2: "",
    })
    const [hotelOptions, setHotelOptions] = React.useState([])
    const [visiteurOptions, setVisiteurOptions] = React.useState([])

    // Methods
    const handleChange = (name, value) => {

        setStateFormData({
            ...stateFormData,
            [name]: value
        })
    }

    const onSubmit = event => {
        event.preventDefault()

        let submittedFormData = {...stateFormData}
        submittedFormData.time_start = moment(stateFormData.visited_at + " " + submittedFormData.time_start)
        submittedFormData.time_end = moment(stateFormData.visited_at + " " + submittedFormData.time_end)

        submittedFormData.visiteurs = [
            submittedFormData.visiteur_id_1,
            submittedFormData.visiteur_id_2,
        ]
        
        utils.fetchReadyData('/visite/create', {
          method: 'PUT',
          body: JSON.stringify(submittedFormData),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {

            if(res.error){
                // show snackbar error
            } else {
                // show snackbar success
                history.push("/planning")
            }
        })
    }

    const onCancel = event => {
        console.log("has cancelled")
    }

    // Lifecylcle

    React.useEffect(() => {
        utils.fetchReadyData('/hotel/all').then(res => {
            if(res.error){
                console.error(res.error)
            } else {
                setHotelOptions(res.data.hotels)
            }
        })

        utils.fetchReadyData('/visiteur').then(res => {
            if(res.error){
                console.error(res.error)
            } else {
                setVisiteurOptions(res.data.visiteurs)
            }
        })

    }, [])

    return (
        <FormRessource
            headingIcon={<IconCalendar/>}
            headingTitle="Créer une visite"
            handleChange={handleChange}
            onSubmit={onSubmit}
            onCancel={onCancel}
            formData={[
                {form_value: stateFormData.visited_at, form_name: "visited_at", inputType: "date", label: "Selectionner la date", placeholder: ""},
                {form_value: [stateFormData.time_start, stateFormData.time_end], form_name: ["time_start", "time_end"], inputType: "range-time", label: "Selectionner l'horaire", placeholder: ["Arrivée", "Sortie"]},

                {form_value: stateFormData.hotel_id, form_name: "hotel_id", inputType: "select", label: "Selectionner un hotel/logement", placeholder: "-- Choix des hotels --",
                    selectOptions: hotelOptions.map(s => ({
                        id: s.id,
                        label: s.nom,
                        value: s.id,
                    }))
                },

                {form_value: [stateFormData.visiteur_id_1, stateFormData.visiteur_id_2], form_name: ["visiteur_id_1", "visiteur_id_2"], inputType: "select-multiple", label: "Selectionner l'équipe", placeholder: ["Agent 1", "Agent 2"],
                selectOptions: visiteurOptions.map(s => ({
                    id: s.id,
                    label: s.nom,
                    value: s.id,
                }))
            },
            ]}
        />
    )
}

export default PageFormHotel