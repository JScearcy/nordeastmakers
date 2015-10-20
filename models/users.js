var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');
var SALT_WORK_FACTOR = 12;

var UserSchema = new mongoose.Schema({

    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    username: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    email: {type: String, required: true},
    client_id: {type: String},
    recurring_id: {type: String},
    businessAcct: {type: Boolean},
    businessAcctUsers: [String],
    accountType: {type: String},
    accessCode: {type: String},
    billDate: {type: String},
    active: {type: Boolean, default: true}
});

UserSchema.pre('save', function (next) {
    var user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the clear-text password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return callback(err);
        return callback(null, isMatch);
    });
};

UserSchema.statics.getAuthenticated = function (user, callback) {
    this.findOne({username: user.username}, function (err, doc) {
        if (err) {
            console.log(err);
            return callback(err);
        }

        // make sure the user exists
        else if (!doc) {
            console.log('No user found,');
            return callback(new Error('Invalid username or password.', 401), null);
        }
        else {
            // test for a matching password
            doc.comparePassword(user.password, function (err, isMatch) {
                if (err) {
                    console.log(err);
                    return callback(err);
                }

                // check if the password was a match
                if (isMatch) {
                    var user = {
                        username: doc.username,
                        id: doc.id,
                        first_name: doc.first_name,
                        last_name: doc.last_name,
                        accountType: doc.accountType
                    };

                    // return the jwt

                    var token = jsonwebtoken.sign(user, process.env.SECRET, {

                        expiresIn: (60 * 60 * 24) // expires in 24 hours

                    });
                    return callback(null, token, user);
                }
                else {
                    return callback(new Error('Invalid username or password.'), null);

                }
            });
        }
    });
};


UserSchema.statics.Create = function (user, callback) {
    // find a user in Mongo with provided username
    this.findOne({'username': user.username}, function (err, doc) {
        // In case of any error return
        if (err) {
            return callback(err);
        }
        // already exists
        if (doc) {
            return callback(new Error('Username Already Exists'), null);
        } else {

            if (user.password != user.confirm) {
                return callback(new Error('Passwords do not match.'), null);
            }

            // if there is no user with that username
            // create the user
            var User =  mongoose.model('User', UserSchema);
            var newUser = new User({
                password: user.password,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                accountType: user.accountType,
                client_id: user.client_id
            });

            // save the user
            newUser.save(function (err) {
                // In case of any error, return using the done method
                if (err) {
                    return callback(err);
                }
                // User Registration succesful
                return callback(null, newUser);
            });
        }
    });
};

module.exports = mongoose.model('Users', UserSchema);
