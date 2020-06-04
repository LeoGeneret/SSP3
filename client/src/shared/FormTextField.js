// Libs
import React from 'react'
import Proptypes from 'prop-types'

function FormTextField(props){
    return (
        <input 
            onChange={props.handleChange} 
            value={props.value}
            className="form__text" 
            type={props.type} 
            placeholder={props.placeholder}
        />
    )
}

FormTextField.propTypes = {
    type: Proptypes.string,
    value: Proptypes.oneOfType([
        Proptypes.string,
        Proptypes.number
    ]),
    handleChange: Proptypes.func,
    placeholder: Proptypes.string,
} 

export default FormTextField