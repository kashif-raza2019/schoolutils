const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    link: String,
    status: {type: Boolean, default: false}
});

// Creating Model from Schema and Exporting
module.exports = mongoose.model('UserStaff', UserSchema);