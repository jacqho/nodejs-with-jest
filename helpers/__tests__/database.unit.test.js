const database = require('../database');
const mongoose = require('mongoose');
const mockingoose = require('mockingoose');
const model = require('../../models/homeowner');
const Homeowner = require('../../models/homeowner');

describe('Homeowner Database Helper', () => {
    let _records;
    beforeEach(() => {
        _records = [
            {
                _id: "617a010fcab2e815114b255c",
                name: "Celine Dion",
                age: 32,
                phone: "548-123-1122",
                email: "celine.dion@gmail.com",
                address: "451 Phillip St, Waterloo, ON N2L 3X2",
                latitude: 60,
                longitude: -90,
                payment: 500000
            },
            {
                _id: "617a010fcab2e815114b2551",
                name: "Deline Lion",
                age: 34,
                phone: "548-111-1122",
                email: "deline.lion@gmail.com",
                address: "111 Phillip St, Waterloo, ON N2L 3X2",
                latitude: 90,
                longitude: -3,
                payment: 1000000
            }
        ];
    });

    describe('Connect Database', () => {
        it('should connect database successfully', async () => {
            jest.spyOn(mongoose, 'connect').mockReturnValueOnce(new Promise(resolve => { resolve(); }));
            await expect(database.connectDB('DUMMY')).resolves.toBe(true);
        });

        it('should failure connect to database', async () => {
            jest.spyOn(mongoose, 'connect').mockImplementationOnce(() => Promise.reject(new Error("Invalid Connection URL")));
            await expect(database.connectDB('DUMMY')).rejects.toEqual(new Error('Unable to connect DB. Error: Invalid Connection URL'));
        });
    });
    
    describe("Save Home Owner Record", () => {
        it('should be able to save record', async() => {
            const _record = _records[0];
            mockingoose(model).toReturn(_record);
            jest.spyOn(new model(_record), 'save').mockImplementation();
            const record = await database.saveRecord(_record);
            expect(JSON.parse(JSON.stringify(record))).toMatchObject(_record);
        });

        it('should be unable to save record', async() => {
            const _record = _records[0];
            mockingoose(model).toReturn(_record);
            jest.spyOn(new model(_record), 'save').mockImplementation(() => Promise.reject(new Error("Failure")));
            await expect(database.saveRecord(_record)).rejects.toEqual(new Error('Unable to save record. Failure'));
        })
    });
    
    describe('Update Home Owner Record', () => {
        it('should be able to update record', async () => {
            const _record = _records[0];
            mockingoose(model).toReturn(_record, 'find');
            _record.name = 'Celine Dion Code';
            _record.age = 55;
            _record.phone = '548-333-1000';
            _record.email = 'celine.dion@hotmail.com';
            _record.address = '454 Phillip St, Waterloo, ON N2L 3X2';
            _record.latitude = 61;
            _record.longitude = 90;
            _record.payment = 700000;
            const result = await database.updateRecord(_record._id, _record);
            expect(result).toBe(true);
        });

        it('should be unable to update record', async () => {
            const _record = _records[0];
            jest.spyOn(Homeowner, 'findByIdAndUpdate').mockImplementation(() => Promise.reject(new Error('Failure')));
            await expect(database.updateRecord(_record._id, _record)).rejects.toEqual(new Error('Unable to save record. Failure'));
        });
    });
    
    describe("Get All Home Owner Records", () => {
        it('should be able to get all the home owner records', async() => {
            jest.spyOn(Homeowner, 'find').mockReturnValueOnce(_records);
            const ret = await database.getAllRecords();
            expect(ret.length).toEqual(2);
        });

        it('should be unable to get home owner records', async() => {
            jest.spyOn(Homeowner, 'find').mockImplementationOnce(() => Promise.reject(new Error("Failure")));
            await expect(database.getAllRecords()).rejects.toEqual(new Error("Unable to get all records. Failure"));
        });
    });
    
    describe("Get Home Owner Record By ID", () => {
        it('should be able to get home owner record by id', async() => {
            const _record = _records[0];
            database.convertToDBObject = jest.fn();
            jest.spyOn(Homeowner, 'findById').mockReturnValueOnce(_record);
            const record = await database.getById(_record._id);
            expect(JSON.parse(JSON.stringify(record))).toMatchObject(_record);
        });
 
        it('should be unable to get home owner record by id', async() => {
            const _record = _records[0];
            database.convertToDBObject = jest.fn();
            jest.spyOn(Homeowner, 'findById').mockImplementationOnce(() => Promise.reject(new Error("Failure")));
            await expect(database.getById(_record._id)).rejects.toEqual(new Error(`Unable to get record, id: ${_record._id}. Failure`));
        });
    });
    
    describe("Get Home Owner Record(s) by Params (Name, Phone, Email ONLY)", () => {
        it('should be able to get home owner records by params', async() => {
            const _record = _records[0];
            jest.spyOn(Homeowner, 'find').mockReturnValueOnce(_record);
            const record = await database.getByParams({ name: _record.name, phone: _record.phone, email: _record.email });
            expect(JSON.parse(JSON.stringify(record))).toMatchObject(_record);
        });

        it('should be unable to get home owner records by params', async() => {
            const _record = _records[0];
            jest.spyOn(Homeowner, 'find').mockImplementationOnce(() => Promise.reject(new Error("Failure")));
            await expect(database.getByParams({ name: _record.name, phone: _record.phone, email: _record.email })).rejects.toEqual(new Error(`Unable to get records, Name: ${_record.name}, phone: ${_record.phone}, email: ${_record.email}. Failure`));
        });
    });
    
    describe("Remove Home Owner Record by Id", () => {
        it('should be able to remove home owner record by id', async() => {
            const _record = _records[0];
            database.convertToDBObject = jest.fn();
            jest.spyOn(Homeowner, 'findByIdAndRemove').mockReturnValueOnce(_record);
            const ret = await database.removeRecord(_record._id);
            expect(ret).toBe(true);
        });

        it('should be not able to remove home owner record by id', async() => {
            const _record = _records[0];
            jest.spyOn(Homeowner, 'findByIdAndRemove').mockImplementationOnce(() => Promise.reject(new Error("Failure")));
            await expect(database.removeRecord(_record._id)).rejects.toEqual(new Error(`Unable to remove record, id: ${_record._id}. Failure`));
        });
    });
    
    describe("Remove Home Owner Records by Ids", () => {
        it('should be able to remove home owner records by Id(s)', async() => {
            jest.spyOn(Homeowner, 'deleteMany').mockReturnValueOnce(true);
            const ret = await database.removeRecords([_records[0]._id, _records[1]._id]);
            expect(ret).toBe(true);
        });

        it('should be unable to remove home owner records by Id(s)', async() => {
            const _recordIds = [_records[0]._id, _records[1]._id];
            jest.spyOn(Homeowner, 'deleteMany').mockImplementationOnce(() => Promise.reject(new Error("Failure")));
            await expect(database.removeRecords([_records[0]._id, _records[1]._id])).rejects.toEqual(new Error(`Unable to remove records, ids: ${_recordIds}. Failure`));
        });
    });
});