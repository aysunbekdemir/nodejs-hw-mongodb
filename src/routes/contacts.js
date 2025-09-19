import { Router } from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import validateBody from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../schemas/contacts.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js'; // Yeni import

const contactsRouter = Router();

contactsRouter.use(authenticate); // Tüm kontak rotaları için kimlik doğrulaması

contactsRouter.get('/', async (req, res, next) => {
  try {
    const contacts = await getAllContacts(req.user);
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
});

contactsRouter.get('/:contactId', isValidId, async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId, req.user);
    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.contactId}`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
});

contactsRouter.post(
  '/',
  upload.single('photo'), // Yeni middleware
  validateBody(createContactSchema),
  async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const newContact = await createContact(req.body, userId, req.file);
      res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
      });
    } catch (error) {
      next(error);
    }
  },
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'), // Yeni middleware
  validateBody(updateContactSchema),
  async (req, res, next) => {
    try {
      const { _id: userId } = req.user;
      const updatedContact = await updateContact(
        req.params.contactId,
        req.body,
        userId,
        req.file,
      );
      if (!updatedContact) {
        return res.status(404).json({
          status: 404,
          message: 'Contact not found',
        });
      }
      res.status(200).json({
        status: 200,
        message: 'Successfully updated a contact!',
        data: updatedContact,
      });
    } catch (error) {
      next(error);
    }
  },
);

contactsRouter.delete('/:contactId', isValidId, async (req, res, next) => {
  try {
    const deletedContact = await deleteContact(req.params.contactId, req.user);
    if (!deletedContact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }
    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

export default contactsRouter;
