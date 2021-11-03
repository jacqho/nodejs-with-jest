const googleAPI = require('../third-parties/google/map-api');
const database = require('../helpers/database');

exports.create = async (req, res) => {
    try{
        const { name, dob, phone, email, address, payment } = req.body.data;
        const age = calculateAge(dob);
        const { latitude, longitude } = await googleAPI.getGeoCoordinates(address);
        const ret = await database.saveRecord({ name, age, phone, email, address, latitude, longitude, payment });
        res.status(201).json(ret);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.update = async (req, res) => {
    try{
        const { id } = req.body;
        const { name, dob, phone, email, address, payment } = req.body.data;
        const age = calculateAge(dob);
        const { latitude, longitude } = await googleAPI.getGeoCoordinates(address);
        
        const ret = await database.updateRecord(id, { name, age, phone, email, address, latitude, longitude, payment });
        res.status(200).json({ message: "Update Record Success" });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.getBy = async (req, res) => {
    try{
        const { name, phone, email } = req.body;
        const ret = await database.getByParams({ name: name, phone: phone, email: email });
        res.status(200).json(ret);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.getById = async (req, res) => {
    try{
        const { id } = req.body;
        const ret = await database.getById(id);
        res.status(200).json(ret);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.getAll = async (req, res) => {
    try{
        ret = await database.getAllRecords();
        res.status(200).json(ret);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}

exports.remove = async (req, res) => {
    try{
        const { id } = req.body;
        const { ids } = req.body;

        if(id != undefined){
            ret = await database.removeRecord(id);
        }
        else{
            ret = await database.removeRecords(ids);
        }
        res.status(200).json({ message: "Remove Record(s) Success" });
    } catch(error){
        res.status(500).json({ message: error.message });
    }
}

calculateAge = (dob) => {
    var dateDiff = Date.now() - dob.getTime();
    var ageByDT = new Date(dateDiff); 

    return Math.abs(ageByDT.getUTCFullYear() - 1970);
}