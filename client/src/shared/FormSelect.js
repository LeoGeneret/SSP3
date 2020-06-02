import React from 'react'
import PropTypes from 'prop-types'

// icons
import IconArrowDown from "../icons/icon-arrow-down"
import IconSearch from "../icons/icon-search"

export default function FormSelect(props){

    // Refs
    const refContainer = React.createRef()

    // States
    const [open, setOpen] = React.useState(false)

    // Methods

    // Lifecycle

    return (
        <div ref={refContainer} className="form__select">
            <select value={props.selected} onChange={props.handleChange} className="form__select__input">
                <option value={null}>{props.placeholder}</option>
                {
                    props.items.map(item => (
                        <option key={item.id} value={item.value}>{item.label}</option>
                    ))
                }
            </select>
        </div>
    )
}

FormSelect.propTypes = {
    placeholder: PropTypes.string,
    items: PropTypes.array,
    selected: PropTypes.any,
    handleChange: PropTypes.func.isRequired,
}