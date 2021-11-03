const mongoose = require("mongoose");
const Homeowner = require('../models/homeowner');

exports.connectDB = async (connection_url) => {
    await mongoose.connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true })
        .catch((error) => {
            throw new Error(`Unable to connect DB. ${error}`);
        });
    return true;
};

exports.saveRecord = async (data) => {
    try{
        const homeowner = new Homeowner(data);
        await homeowner.save();
        return homeowner;
    }
    catch(error){
        throw new Error(`Unable to save record. ${error.message}`);
    }
}

exports.updateRecord = async (id, data) => {
    try{
        await Homeowner.findByIdAndUpdate(id, data, { new: true });
        return true;
    }
    catch(error){
        throw new Error(`Unable to save record. ${error.message}`);
    }
}

exports.getAllRecords = async () => {
    try{
        return await Homeowner.find();
    }
    catch(error){
        throw new Error(`Unable to get all records. ${error.message}`);
    }
}

exports.getById = async(id) => {
    try{
        return await Homeowner.findById(mongoose.Types.ObjectId(id));
    }
    catch(error){
        throw new Error(`Unable to get record, id: ${id}. ${error.message}`);
    }
}

exports.getByParams = async(params) => {
    try{
        const { name, phone, email } = params;
        return await Homeowner.find({$or:[{ name: name },{ phone: phone}, { email: email }]});
    }
    catch(error){
        throw new Error(`Unable to get records, Name: ${params.name}, phone: ${params.phone}, email: ${params.email}. ${error.message}`);
    }
}

exports.removeRecord = async(id) => {
    try{
        await Homeowner.findByIdAndRemove(mongoose.Types.ObjectId(id))
        return true;
    }
    catch(error){
        throw new Error(`Unable to remove record, id: ${id}. ${error.message}`);
    }
}

exports.removeRecords = async(ids) => {
    try{
        await Homeowner.deleteMany({
            _id: {
                $in: ids
            }
        })
        return true;
    }
    catch(error){
        throw new Error(`Unable to remove records, ids: ${ids}. ${error.message}`);
    }
}