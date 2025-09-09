const contactsService = require('../services/contacts');
const createError = require('http-errors');
const Contact = require('../db/models/Contact');

const getAllContacts = async (req, res) => {
    const contacts = await contactsService.fetchAllContacts();
    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
    });
};

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const contact = await contactsService.fetchContactById(contactId);

    if (!contact) {
        throw createError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

const createContact = async (req, res, next) => {
    try {
        const { name, phoneNumber, email, isFavourite, contactType } = req.body;
        const userId = req.user._id; // Ensure userId is included

        const newContact = await Contact.create({
            name,
            phoneNumber,
            email,
            isFavourite,
            contactType,
            userId,
        });

        res.status(201).json({
            status: 201,
            message: 'Successfully created a contact!',
            data: newContact,
        });
    } catch (error) {
        next(error);
    }
};

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const updatedContact = await contactsService.updateContact(contactId, req.body);

    if (!updatedContact) {
        throw createError(404, 'Contact not found');
    }

    
    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: updatedContact,
    });
};

const deleteContact = async (req, res) => {
    const { contactId } = req.params;
    const deletedContact = await contactsService.deleteContact(contactId);

    if (!deletedContact) {
        throw createError(404, 'Contact not found');
    }

    res.status(204).send();
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
};
