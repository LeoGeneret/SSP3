// Libs
import React from 'react'
import Proptypes from 'prop-types'


function FormDatePicker(props){


    // States

    // Methods

    return (
        <input 
            value={props.value}
            onChange={props.handleChange}
            placeholder={props.placeholder}
            className="form__datepicker" 
            type="date" 
        />
    )
}

FormDatePicker.propTypes = {
    value: Proptypes.string,
    handleChange: Proptypes.func,
    placeholder: Proptypes.string,
} 

export default FormDatePicker