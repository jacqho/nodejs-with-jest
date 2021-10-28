const mockingoose = require('mockingoose');
const model = require('../homeowner');

describe('Homeowner Model', () => {
    let _records = [];
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

    it('should save the record with save', () => {
        const _record = _records[0];
        var _newRecord = new model(_record);
        jest.spyOn(_newRecord, 'save').mockImplementation();
        expect(_newRecord.save());
    });

    it('should return the record with findById', () => {
        const _record = _records[0];
        mockingoose(model).toReturn(_record, 'findOne');
        return model.findById({ _id: _record._id }).then(record => {
            expect(JSON.parse(JSON.stringify(record))).toMatchObject(_record);
        }).catch(error => {
            fail(`Unable to do findById. error: ${error}`);
        });
    });

    it('should return the record with findByIdAndUpdate', () => {
        const _record = _records[0];
        mockingoose(model).toReturn(_record, 'findOneAndUpdate');
        _record.name = "Celine Dion Code";
        _record.age = 55;
        _record.phone = "548-333-1000";
        _record.email = "celine.dion@hotmail.com";
        _record.address = "454 Phillip St, Waterloo, ON N2L 3X2";
        _record.latitude = 61;
        _record.longitude = 90;
        _record.payment = 700000;
        return model.findByIdAndUpdate(_record._id, _record).then(record => {
            expect(record.name).toBe(_record.name);
            expect(record.age).toBe(_record.age);
            expect(record.phone).toBe(_record.phone);
            expect(record.email).toBe(_record.email);
            expect(record.address).toBe(_record.address);
            expect(record.latitude).toBe(_record.latitude);
            expect(record.longitude).toBe(_record.longitude);
            expect(record.payment).toBe(_record.payment);
        }).catch(error => {
            fail(`Unable to do findByIdAndUpdate. error: ${error}`);
        });
    });

    it('should return the record with find', () => {
        mockingoose(model).toReturn(_records, 'find');
        return model.find().then(records => {
            expect(JSON.parse(JSON.stringify(records))).toMatchObject(_records);
        }).catch(error => {
            fail(`Unable to do findByIdAndUpdate. error: ${error}`);
        });
    });

    it('should remove the record with findByIdAndRemove', () => {
        const _record = _records[0];
        mockingoose(model).toReturn(_record, 'findOneAndRemove');
        return model.findByIdAndRemove(_record._id).then(record => {
            expect(record.name).toBe(_record.name);
            expect(record.age).toBe(_record.age);
            expect(record.phone).toBe(_record.phone);
            expect(record.email).toBe(_record.email);
            expect(record.address).toBe(_record.address);
            expect(record.latitude).toBe(_record.latitude);
            expect(record.longitude).toBe(_record.longitude);
            expect(record.payment).toBe(_record.payment);
        }).catch(error => {
            fail(`Unable to do findByIdAndRemove. error: ${error}`);
        });
    });

    it('should remove the records with deleteMany', () => {
        const _ids = [_records[0]._id, _records[1]._id];
        mockingoose(model).toReturn(_records, 'deleteMany');
        return model.deleteMany(_ids).then(records => {
            expect(JSON.parse(JSON.stringify(records))).toMatchObject(_records);
        }).catch(error => {
            fail(`Unable to do deleteMany. error: ${error}`);
        });
    });
});