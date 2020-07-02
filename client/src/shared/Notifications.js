// Libs
import React from "react"


// Icons
import IconNotifications from "../icons/icon-notifications"
import IconCross from "../icons/icon-cross"
import IconAttention from "../icons/icon-attention"

export default function Notifications(){

    const [isOpen, setIsOpen] = React.useState(true)

    // methods

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className="notifications">

            <button onClick={toggleModal}className="notifications__btn">
                {isOpen ? <IconCross/> : <IconNotifications/>}
            </button>

            {isOpen && <div className="notifications__list">

                <div className="notifications__list-title">Notifications en attente</div>

                <div>
                {
                    [1, 2 ,3].map((notification, index) => {



                        return (
                            <div key={index} className="notifications__list-item">
                                <div className="notifications__list-item-header">
                                    <div className="notifications__list-item-warning">
                                        <IconAttention/>
                                    </div>
                                    <div className="notifications__list-item-heading">Incapacité de rendez-vous</div>
                                    <div className="notifications__list-item-date">Il y a 2 heures</div>
                                </div>
                                <div className="notifications__list-item-body">
                                    <p className="notifications__list-item-message">
                                        {"Jean-Claude C"} ne peut être présent pour la visite de {"9h-12h"} à l’hotel {"Starplus"}.
                                    </p>
                                </div>
                                <div className="notifications__list-item-footer">
                                    <p className="notifications__list-item-motif">
                                        <strong>Motif :</strong> "{"Ralentissement sur le périphérique Nord."}"
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
                </div>

            </div>}

        </div>
    )
}