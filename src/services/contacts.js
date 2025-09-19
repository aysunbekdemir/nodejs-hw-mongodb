import createHttpError from 'http-errors';
import Contact from '../db/models/contact.js';

export const createContact = async (payload, userId) => {
  const contact = await Contact.create({ ...payload, userId });
  return contact;
};

export const getContacts = async (userId) => {
  const contacts = await Contact.find({ userId });
  return contacts;
};

export const getContactById = async (id, userId) => {
  const contact = await Contact.findOne({ _id: id, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const updateContact = async (id, payload, userId) => {
  const contact = await Contact.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const deleteContact = async (id, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: id, userId });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};
