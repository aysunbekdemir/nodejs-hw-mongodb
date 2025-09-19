import createHttpError from 'http-errors';
import Contact from '../db/models/contact.js';

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const getContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const updateContact = async (id, payload) => {
  const contact = await Contact.findByIdAndUpdate(id, payload, { new: true });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};

export const deleteContact = async (id) => {
  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  return contact;
};