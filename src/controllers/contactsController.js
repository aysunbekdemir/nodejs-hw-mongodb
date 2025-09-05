const contactsService = require('../services/contacts');

const getAllContacts = async (req, res) => {
    try {
        const contacts = await contactsService.fetchAllContacts();
        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts, // Veritabanından dönen iletişimler
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed to fetch contacts',
            error: error.message,
        });
    }
};

const getContactById = async (req, res) => {
    try {
        const { contactId } = req.params;
        const contact = await contactsService.fetchContactById(contactId);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed to fetch contact',
            error: error.message,
        });
    }
};

module.exports = { getAllContacts, getContactById };
