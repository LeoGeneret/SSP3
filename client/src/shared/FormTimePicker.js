// Libs
import React from 'react'
import Proptypes from 'prop-types'


export default function FormTimePicker(props){


    // States

    // Methods

    return (
        <input 
            value={props.value}
            onChange={props.handleChange}
            placeholder={props.placeholder}
            className="form__datepicker" 
            type="time" 
        />
    )
}

FormTimePicker.propTypes = {
    value: Proptypes.string,
    handleChange: Proptypes.func,
    placeholder: Proptypes.string,
} 