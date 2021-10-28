const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        maxLength: 255
    },
    age: {
        type: Number,
        min: 18,
        max: 120
    },
    phone: {
        type: String,
        require: true,
        match: /^([0-9]{3})-([0-9]{3})-([0-9]{4})$/,
        maxLength: 14
    },
    email: {
        type: String,
        require: true,
        match: /^(.+)@(\S+)$/
    },
    address: {
        type: String,
        require: true,
        maxLength: 500
    },
    latitude: {
        type: Number,
        min: -90,
        max: 90
    },
    longitude: {
        type: Number,
        min: -180,
        max: 180
    },
    payment: {
        type: Number,
        min: 0
    }
});

let Homeowner = mongoose.model("Homeowner", schema);

module.exports = Homeowner;