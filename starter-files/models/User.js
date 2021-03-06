const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        require: 'Please supply an email address'
    },
    name: {
        type: String,
        require: 'Please supply a name',
        trim: true
    },
    admin: Boolean,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    bookmarked: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Store'
        }
    ]
});

//Allow user to add image
userSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=50`
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);