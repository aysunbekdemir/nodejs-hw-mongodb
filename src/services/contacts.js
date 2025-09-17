import { Contact } from '../db/models/Contact.js';

export const getContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find({ ...filter, userId });

  const totalItems = await Contact.countDocuments({ ...filter, userId });
  const totalPages = Math.ceil(totalItems / perPage);

  const data = await contactsQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export const getContactById = (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const createContact = (data) => {
  return Contact.create(data);
};

export const updateContact = async (contactId, userId, data) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    data,
    { new: true, runValidators: true },
  );

  if (!rawResult) return null;

  return {
    contact: rawResult,
  };
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  return contact;
};
