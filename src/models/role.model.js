const mongoose = require('mongoose')
const validator = require('validator')

// Put as much business logic in the models to keep the controllers as simple and lean as possible
const roleSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'A role must have a name'], trim: true, unique: true },
    email: { 
        type: String, 
        required: [true, 'A user must have an email'], 
        trim: true, 
        unique: true, 
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    isActive: { type: Boolean, default: true, select: false }
}, { timestamps: true }); 

module.exports = Role = mongoose.model('Roles', roleSchema);
