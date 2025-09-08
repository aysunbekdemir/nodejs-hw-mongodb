const Contact = require('../db/models/Contact');

const fetchAllContacts = async () => {
    return await Contact.find(); // Veritabanındaki tüm iletişimleri döndür
};

const fetchContactById = async (contactId) => {
    return await Contact.findById(contactId);
};

const createContact = async (contactData) => {
    return await Contact.create(contactData);
};

const updateContact = async (contactId, updateData) => {
    return await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
};

const deleteContact = async (contactId) => {
    return await Contact.findByIdAndDelete(contactId);
};

module.exports = { 
    fetchAllContacts, 
    fetchContactById,
    createContact,
    updateContact,
    deleteContact,
};
