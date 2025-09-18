import { Contact } from '../db/models/Contact.js';

export const getAllContacts = async () => await Contact.find();
export const getContactById = async (contactId) => await Contact.findById(contactId);

export const createContact = async (payload) => await Contact.create(payload);

export const updateContact = async (contactId, payload) => await Contact.findByIdAndUpdate(contactId, payload, { new: true });
export const deleteContact = async (contactId) => await Contact.findByIdAndDelete(contactId);