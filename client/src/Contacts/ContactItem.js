import React,{ Fragment,useContext } from 'react'
import ContactContext from '../context/contact/contactContext'

const ContactItem = ({ contact }) => {
    const contactContext = useContext(ContactContext);
    const { _id,name,type,email,phone } = contact;
    const { deleteContact,setCurrent,clearCurrent } = contactContext;

    const onDelete = () => {
        deleteContact(_id);
        clearCurrent();
    }

    return (
        <Fragment>
            <div className="card bg-light ">
                <h3 className="text-primary text-left">{name}{" "}
                <span style={{ float : 'right'}} className={'badge ' + (type === 'professional' ? 'badge-success' : 'badge-primary')}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </h3>
                <div>
                    <ul className="list">
                        {email && (<li>
                            <i className="fas fa-envelope-open"></i> {email}
                        </li>)}
                        {phone && (<li>
                            <i className="fas fa-phone"></i> {phone}
                        </li>)}
                        <div>
                            <button className="btn btn-success btn-sm" onClick={() => setCurrent(contact)} >Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
                        </div>
                    </ul>
                </div>
            </div>
        </Fragment>
    )
}

export default ContactItem;