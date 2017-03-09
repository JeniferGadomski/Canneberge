"use strict";
var User = (function () {
    function User(firstname, lastname, username, email, admin) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.email = email;
        this.admin = admin;
    }
    return User;
}());
exports.User = User;
