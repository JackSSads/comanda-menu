const mongoose = require("mongoose");

const User = mongoose.model("User", {
    nameUser: String,
    func: String,
    email: String,
    pass: String,
});

module.exports = User;