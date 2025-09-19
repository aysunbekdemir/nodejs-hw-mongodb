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
import authenticate from '../middlewares/authenticate.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contacts.js';
import validateBody from '../middlewares/validateBody.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', async (req, res, next) => {
  try {
    const contacts = await getContacts(req.user.userId);
    res.json(contacts);
  } catch (err) {
    next(createHttpError(500, 'Failed to retrieve contacts'));
  }
});

contactsRouter.get('/:id', isValidId, async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.id, req.user.userId);
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  async (req, res, next) => {
    try {
      const contact = await createContact(req.body, req.user.userId);
      res.status(201).json(contact);
    } catch (err) {
      next(createHttpError(500, 'Failed to create contact'));
    }
  },
);

contactsRouter.patch(
  '/:id',
  isValidId,
  validateBody(updateContactSchema),
  async (req, res, next) => {
    try {
      const contact = await updateContact(
        req.params.id,
        req.body,
        req.user.userId,
      );
      res.json(contact);
    } catch (err) {
      next(err);
    }
  },
);

contactsRouter.delete('/:id', isValidId, async (req, res, next) => {
  try {
    const contact = await deleteContact(req.params.id, req.user.userId);
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

export default contactsRouter;
