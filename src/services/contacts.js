const Contact = require('../db/models/Contact');

const fetchAllContacts = async () => {
    return await Contact.find(); // Veritabanındaki tüm iletişimleri döndür
};

const fetchContactById = async (contactId) => {
    return await Contact.findById(contactId);
};

module.exports = { 
    fetchAllContacts, 
    fetchContactById 
};
