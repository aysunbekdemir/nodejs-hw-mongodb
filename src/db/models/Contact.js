const mongoose = require('mongoose');
const Joi = require('joi');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: { 
        type: String, 
        enum: ['work', 'home', 'personal'], 
        required: true, 
        default: 'personal' 
    }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

const contactValidationSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().optional(),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

module.exports = { Contact, contactValidationSchema };
