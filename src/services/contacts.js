const Contact = require('../db/models/Contact');

const fetchAllContacts = async () => {
    return await Contact.find();
};

const fetchContactById = async (contactId) => {
    return await Contact.findById(contactId);
};

module.exports = { 
    fetchAllContacts, 
    fetchContactById 
};
