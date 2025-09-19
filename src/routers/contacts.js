import { Router } from 'express';
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js'; // Bu satırı ekleyin

const contactsRouter = Router();

// authenticate middleware'ini tüm rotalara ekleyin
contactsRouter.use(authenticate);

contactsRouter.get('/', async (req, res, next) => {
  try {
    const contacts = await getContacts();
    res.json(contacts);
  } catch (err) {
    next(createHttpError(500, 'Failed to retrieve contacts'));
  }
});

contactsRouter.get('/:id', isValidId, async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id);
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

contactsRouter.post('/', async (req, res, next) => {
  try {
    const contact = await createContact(req.body);
    res.status(201).json(contact);
  } catch (err) {
    next(createHttpError(500, 'Failed to create contact'));
  }
});

contactsRouter.patch('/:id', isValidId, async (req, res, next) => {
  try {
    const contact = await updateContact(req.params.id, req.body);
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

contactsRouter.delete('/:id', isValidId, async (req, res, next) => {
  try {
    const contact = await deleteContact(req.params.id);
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

export default contactsRouter;