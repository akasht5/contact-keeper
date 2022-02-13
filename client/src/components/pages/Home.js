import React,{useContext,useEffect} from 'react'
import ContactForm from '../../Contacts/ContactForm'
import Contacts from '../../Contacts/Contacts'
import ContactFilter from '../../Contacts/ContactFilter'
import AuthContext from '../../context/auth/authContext'

const Home = () => {
    const authContext = useContext(AuthContext);
    useEffect(() => {
        authContext.loadUser();

    // eslint-disable-next-line
    },[]);
    
    return (
        <div className="container grid-2">
            <div>
                <ContactForm />
            </div>
            <div>
                <ContactFilter />
                <Contacts />
            </div>
        </div>
    )
}

export default Home