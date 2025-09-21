const contactsService = require('../services/contacts');
const createError = require('http-errors');

const getAllContacts = async (req, res, next) => {
    try {
        const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc' } = req.query;

        const skip = (page - 1) * perPage;
        const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const totalItems = await Contact.countDocuments();
        const contacts = await Contact.find().skip(skip).limit(Number(perPage)).sort(sort);

        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts!',
            data: {
                data: contacts,
                page: Number(page),
                perPage: Number(perPage),
                totalItems,
                totalPages: Math.ceil(totalItems / perPage),
                hasPreviousPage: page > 1,
                hasNextPage: page * perPage < totalItems,
            },
        });
    } catch (error) {
        next(error);
    }
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

const createContact = async (req, res) => {
    const newContact = await contactsService.createContact(req.body);
    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
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
