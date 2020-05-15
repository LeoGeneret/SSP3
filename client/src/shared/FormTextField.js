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
    value: Proptypes.string,
    handleChange: Proptypes.func,
    placeholder: Proptypes.string,
} 

export default FormTextField