/**
 * Created by Mothra on 10/15/15.
 */
customValidators = {
    isUsername: function(value) {
        //test username and any other pattern needing letters, numbers, spaces, and _ .
        var userRegEx = /^[a-zA-Z0-9!@](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){4,18}[a-zA-Z0-9]$/;
        return userRegEx.test(value);
    },
    isFirstName: function(value) {
        //test for only letters and spaces
        var nameRegEx = /([a-zA-Z]{2,30}\s*)+/;
        return nameRegEx.test(value);
    },
    isLastName: function(value) {
        //test for only letters and spaces
        var nameRegEx = /[a-z A-Z]{2,30}/;
        return nameRegEx.test(value);
    },
    isMobile: function(value) {
        //test for only letters and spaces
        var nameRegEx = /[a-z A-Z]{2,30}/;
        return nameRegEx.test(value);
    },
    isEmail: function(value) {
        var objectIdRegEx = / /;
        return objectIdRegEx.test(value);
    },
    //test passwords for one letter, number, and special char within a pw 8-32 chars long
    isPassword: function(value) {
        var passRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
        return passRegEx.test(value);
    }
};

module.exports = customValidators;