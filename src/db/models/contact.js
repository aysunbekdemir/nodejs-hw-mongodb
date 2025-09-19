import { Schema, model } from 'mongoose';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
    },
    photo: {
      // Yeni eklenen alan
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
  },
  {
    timestamps: true,
  },
);

const Contact = model('contacts', contactsSchema);

export default Contact;
