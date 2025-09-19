import { Router } from 'express';
import { getAllContacts, getContactById, createContact, deleteContact, updateContact } from '../services/contacts.js';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import { createContactSchema, updateContactSchema } from '../schemas/contacts.js';
import createHttpError from 'http-errors';

const contactsRouter = Router();

contactsRouter.use(authenticate); // Tüm kontak rotalarına yetkilendirme middleware'ini uyguluyoruz.

contactsRouter.get('/', async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy, sortOrder = 'asc', type, isFavourite } = req.query;
    const { _id: userId } = req.user;

    const filter = {};
    if (type) {
      filter.contactType = type;
    }
    if (isFavourite !== undefined) {
      filter.isFavourite = isFavourite === 'true';
    }

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const pagination = {
      page: parseInt(page),
      perPage: parseInt(perPage),
    };

    const result = await getAllContacts(filter, sort, pagination, userId);
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

contactsRouter.get('/:contactId', isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const contact = await getContactById(contactId, userId);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
});

// Yeni CRUD rotalarını ekliyoruz
contactsRouter.post('/', validateBody(createContactSchema), authenticate, async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const newContact = await createContact(req.body, userId);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
});

contactsRouter.delete('/:contactId', isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const deletedContact = await deleteContact(contactId, userId);
    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

contactsRouter.patch('/:contactId', isValidId, validateBody(updateContactSchema), async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const updatedContact = await updateContact(contactId, req.body, userId);
    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully updated a contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
});

export default contactsRouter;