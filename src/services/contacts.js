import { Contact } from '../db/models/Contact.js';

export const getAllContacts = (userId) => {
  return Contact.find({ userId });
};

export const getContactById = (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const createContact = (data, userId) => {
  return Contact.create({ ...data, userId });
};

export const updateContact = (contactId, data, userId) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    { new: true, runValidators: true }
  );
};

export const deleteContact = (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};

export default {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
