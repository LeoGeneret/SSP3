// Libs
import React from 'react'
import Proptypes from 'prop-types'
import {useHistory} from 'react-router-dom'

// Shared
import FormSelect from '../shared/FormSelect'
import FormDatePicker from '../shared/FormDatePicker'
import FormTimePicker from '../shared/FormTimePicker'
import FormTextField from '../shared/FormTextField'

const INPUT_TYPE = ["text", "select", "number", "date", "range-time", "select-multiple"]


export default function FormRessource(props){

    // History
    const history = useHistory()

    // Methods

    return (
        <div className="page-ressource">

            <div className="page-ressource__heading">
                <div className="page-ressource__heading__icon">
                    {props.headingIcon}
                </div>
                <h1 className="page-ressource__heading__title">{props.headingTitle}</h1>
            </div>

            <form onSubmit={props.onSubmit} className="page-ressource__form form">
                
                <div className="page-ressource__form__body">

                    {
                        props.formData.map((formDataItem, i) => {

                            const type = formDataItem.inputType
                            const label = formDataItem.label
                            const placeholder = formDataItem.placeholder
                            const form_name = formDataItem.form_name
                            const form_value = formDataItem.form_value


                            if(type === "text" || type === "number" || type === "number"){
                                return (
                                    <div key={form_name + i} className="form__row">
                                        <div className="form__label">{label}</div>
                                        <FormTextField
                                            handleChange={event => props.handleChange(form_name, event.target.value)} 
                                            value={form_value}
                                            type={type} 
                                            placeholder={placeholder}
                                        />
                                    </div>
                                )
                            }

                            else if(type === "select"){

                                const selectOptions = formDataItem.selectOptions

                                return (
                                    <div key={form_name + i} className="form__row">
                                        <div className="form__label">{label}</div>
                                        <FormSelect 
                                            placeholder={placeholder}
                                            items={selectOptions}
                                            selected={form_value}
                                            handleChange={event => props.handleChange(form_name, event.target.value)}
                                        />
                                    </div>
                                )
                            }

                            else if(type === "select-multiple"){

                                const selectOptions = formDataItem.selectOptions

                                return (
                                    <div key={form_name + i} className="form__row-multiple-rows">
                                        <div className="form__label">{label}</div>
                                        <FormSelect 
                                            placeholder={placeholder[0]}
                                            items={selectOptions}
                                            selected={form_value[0]}
                                            handleChange={event => props.handleChange(form_name[0], event.target.value)}
                                        />
                                        <FormSelect 
                                            placeholder={placeholder[1]}
                                            items={selectOptions}
                                            selected={form_value[1]}
                                            handleChange={event => props.handleChange(form_name[1], event.target.value)}
                                        />
                                    </div>
                                )
                            }
                            
                            else if(type === "date"){

                                return (
                                    <div key={form_name + i} className="form__row">
                                        <div className="form__label">{label}</div>
                                        <FormDatePicker
                                            value={form_value}
                                            placeholder={placeholder}
                                            handleChange={event => props.handleChange(form_name, event.target.value)}
                                        />
                                    </div>
                                )
                            }

                            else if(type === "range-time"){

                                return (
                                    <div className="form__row">
                                        <div className="form__label">{label}</div>
                                        <div className="form__row-multiple-cols">
                                            <FormTimePicker
                                                placeholder={placeholder[0]}
                                                value={form_value[0]}
                                                handleChange={event => props.handleChange(form_name[0], event.target.value)}
                                                />
                                            <FormTimePicker
                                                placeholder={placeholder[1]}
                                                value={form_value[1]}
                                                handleChange={event => props.handleChange(form_name[1], event.target.value)}

                                            />
                                        </div>
                                    </div>
                                )
                            }

                            return ""
                        })
                    }
                    {/* <div className="form__row">
                        <div className="form__label">Selectionner un secteur</div>
                        <FormSelect 
                            placeholder="Secteur de travail"
                            items={[
                                {id: "0", label: "77-23", value: 1},
                                {id: "1", label: "23-23", value: 2},
                                {id: "2", label: "54-2", value: 3},
                                {id: "3", label: "87-11", value: 4},
                            ]}
                        />
                    </div>

                    <div className="form__row">
                        <div className="form__label">Selectionner une date</div>
                        <FormDatePicker
                        />
                    </div>

                    <div className="form__row">
                        <div className="form__label">Commentaire (facultatif)</div>
                        <textarea
                            className="page-ressource__form__textarea"
                        ></textarea>
                    </div>

                    <div className="form__row">
                        <div className="form__label">Selectionner une date</div>
                        <div className="form__row-multiple">
                            <FormTimePicker
                            />
                            <FormTimePicker
                            />
                        </div>
                    </div> */}
                </div>

                <div className="page-ressource__form__footer">
                    <button onClick={() => history.goBack()} type="button" className="form__btn">Annuler</button>
                    <button type="submit" className="form__btn form__btn--submit">Suivant</button>
                </div>

            </form>

        </div>
    )
}



FormRessource.propTypes = {
    headingTitle: Proptypes.string.isRequired,
    formData: Proptypes.arrayOf(Proptypes.shape({

        inputType: Proptypes.oneOf(INPUT_TYPE),
        label: Proptypes.string.isRequired,
        placeholder: Proptypes.string.isRequired,

        form_name: Proptypes.string.isRequired,
        form_value: Proptypes.any,


    })).isRequired,

    handleChange: Proptypes.func.isRequired,
    onCancel: Proptypes.func.isRequired,
    onSubmit: Proptypes.func.isRequired,

    headingIcon: Proptypes.element.isRequired
}
