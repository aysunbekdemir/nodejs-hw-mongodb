const express = require('express');
const ctrlWrapper = require('../utils/ctrlWrapper');
const validateBody = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');
const contactsController = require('../controllers/contacts');
const { contactSchema } = require('../db/models/Contact');

const router = express.Router();

router.get('/', ctrlWrapper(contactsController.getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(contactsController.getContactById));
router.post('/', validateBody(contactSchema), ctrlWrapper(contactsController.createContact));
router.patch('/:contactId', isValidId, validateBody(contactSchema), ctrlWrapper(contactsController.updateContact));
router.delete('/:contactId', isValidId, ctrlWrapper(contactsController.deleteContact));

module.exports = router;
