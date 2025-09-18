import { Contact } from '../db/models/Contact.js';

export const getAllContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (payload) => {
  return await Contact.create(payload);
};

export const updateContact = async (contactId, payload, userId) => {
  const rawResult = await Contact.findOneAndUpdate(
    { _id: contactId, userId }, // Sadece o kullanıcıya ait kişiyi bul
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  return rawResult; // Eğer kişi bulunamazsa null dönecektir
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  return contact;
};