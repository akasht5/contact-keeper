import React,{ Fragment,useState,useContext,useEffect } from 'react'
import ContactContext from '../context/contact/contactContext'

const ContactForm = () => {
    const contactContext = useContext(ContactContext);

    const [ contact,setContact ] = useState({
        name : '',
        email : '',
        phone : '',
        type : 'personal'
    });

    const { name,email,phone,type } = contact;
    const { addContact,current,clearCurrent,updateContact } = contactContext;

    useEffect(() => {
        if(current !== null){
            setContact(current);
        }else{
            setContact({
                name : '',
                email : '',
                phone : '',
                type : 'personal'
            })
        }
    },[contactContext,current]);

    const onChange = e => {
        setContact({
            ...contact,[e.target.name] : e.target.value
        })
    }
    
    const clearAll = () => {
        clearCurrent();
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if(current === null){
            addContact(contact);
        }else{
            updateContact(contact);
        }
        clearAll();
        
    }

    return (
        <Fragment>
            <h3>{ current ? 'Edit Contact' : 'Add Contact'}</h3>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Name" name="name" value={name} onChange={onChange} />
                <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} />
                <input type="text" placeholder="Phone" name="phone" value={phone} onChange={onChange} />
                <label>Contact Type : </label>
                <input type="radio" name="type" value="personal" onChange={onChange} checked={type === 'personal'} /> Personal{' '}
                <input type="radio" name="type" value="professional" onChange={onChange} checked={type === 'professional'} /> Professional
                <input type="submit" name="submit" value={ current ? 'Update Contact' : 'Add Contact'} className="btn btn-primary btn-block" /> 
                { current && <div>
                        <button className="btn btn-light btn-block" onClick={clearAll}>Clear</button>
                    </div> }
            </form>
        </Fragment>
    )
}

export default ContactForm