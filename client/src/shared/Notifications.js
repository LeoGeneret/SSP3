// Libs
import React from "react"
import Proptypes from "prop-types"
import moment from "moment"


// Icons
import IconNotifications from "../icons/icon-notifications"
import IconCross from "../icons/icon-cross"
import IconAttention from "../icons/icon-attention"

function Notifications(props){

    const [isOpen, setIsOpen] = React.useState(false)

    // methods

    const toggleModal = () => {

        if(isOpen){
            props.notifyNotifications()
        }

        setIsOpen(!isOpen)
    }


    let notNotifiedCount = props.notifications.filter(n => !n.notified).length

    return (
        <div className="notifications">

            <button onClick={toggleModal}className="notifications__btn">
                {isOpen ? (
                    <IconCross/>
                ) : (
                    <React.Fragment>
                        {notNotifiedCount >= 1 && <span className="notifications__btn-count">{notNotifiedCount}</span>}
                        <IconNotifications/>
                    </React.Fragment>
                )}
            </button>

            {isOpen && <div className="notifications__list">

                <div className="notifications__list-title">Notifications en attente</div>

                <div className="notifications__list-track">
                {
                    props.notifications.map((notification, index) => {

                        // created at
                        let now = moment()
                        let createdAt = moment(notification.created_at)

                        if(now.diff(createdAt, "minute") < 60){
                            createdAt = now.diff(createdAt, "minute") + " minutes"

                        } 
                        else if(now.diff(createdAt, "hour") < 24){
                            createdAt = now.diff(createdAt, "hour") + " heures"

                        } 
                        else if(now.diff(createdAt, "hour") < 24){
                            createdAt = now.diff(createdAt, "hour") + " heures"

                        } 
                        else {
                            createdAt = now.diff(createdAt, "day") + " jours"
                        }

                        // date visite
                        let horaire = `${moment(notification.visit.time_start).hour()}h-${moment(notification.visit.time_end).hour()}h`


                        return (
                            <div key={index} className={`notifications__list-item ${notification.notified ? "notifications__list-item--notified" : ""}`}>
                                <div className="notifications__list-item-header">
                                    <div className="notifications__list-item-warning">
                                        <IconAttention/>
                                    </div>
                                    <div className="notifications__list-item-heading">Incapacité de rendez-vous</div>
                                    <div className="notifications__list-item-date">Il y a {createdAt}</div>
                                </div>
                                <div className="notifications__list-item-body">
                                    <p className="notifications__list-item-message">
                                        {notification.reported_by.nom} ne peut être présent pour la visite de {horaire} à l’hotel <strong> {notification.visit.hotel.nom}</strong>.
                                    </p>
                                </div>
                                <div className="notifications__list-item-footer">
                                    <p className="notifications__list-item-motif">
                                        <strong>Motif :</strong> "{notification.motif}"
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

Notifications.propTypes = {
    notifications: Proptypes.array,
    notifyNotifications: Proptypes.func
}

export default Notifications