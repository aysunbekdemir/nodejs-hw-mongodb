import Contact from '../db/models/contact.js';
import {
  savePhotoToCloudinary,
  deletePhotoFromCloudinary,
} from './cloudinary.js';
import createHttpError from 'http-errors';

export const getAllContacts = async (user) => {
  return await Contact.find({ owner: user._id });
};

export const getContactById = async (contactId, user) => {
  return await Contact.findOne({ _id: contactId, owner: user._id });
};

export const createContact = async (payload, userId, file) => {
  const photoUrl = file ? await savePhotoToCloudinary(file.path) : null;
  return await Contact.create({
    ...payload,
    photo: photoUrl,
    owner: userId,
  });
};

export const updateContact = async (contactId, payload, userId, file) => {
  if (file) {
    const contact = await Contact.findById(contactId);
    if (contact && contact.photo) {
      await deletePhotoFromCloudinary(contact.photo);
    }
    payload.photo = await savePhotoToCloudinary(file.path);
  }
  return await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    payload,
    { new: true },
  );
};

export const deleteContact = async (contactId, user) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    owner: user._id,
  });
  if (contact && contact.photo) {
    await deletePhotoFromCloudinary(contact.photo);
  }
  return contact;
};
