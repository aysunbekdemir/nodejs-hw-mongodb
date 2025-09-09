const mongoose = require('mongoose');

const isValidId = (req, res, next) => {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid ID format',
        });
    }
    next();
};

module.exports = isValidId;