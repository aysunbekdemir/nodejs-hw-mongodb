import Contact from '../db/models/contact.js';

export const getAllContacts = async (filter, sort, pagination, userId) => {
  const { page, perPage } = pagination;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find({ ...filter, userId })
    .sort(sort)
    .skip(skip)
    .limit(perPage);

  const contacts = await contactsQuery.exec();
  const totalItems = await Contact.countDocuments({ ...filter, userId });
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  return contact;
};

// Yeni rotalar için gerekli CRUD fonksiyonlarını da eklemelisiniz.
// Örneğin:
export const createContact = async (payload, userId) => {
  const newContact = await Contact.create({ ...payload, userId });
  return newContact;
};

export const deleteContact = async (contactId, userId) => {
  const deletedContact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return deletedContact;
};

export const updateContact = async (contactId, payload, userId) => {
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    { new: true },
  );
  return updatedContact;
};
