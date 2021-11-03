const homeownerController = require('../homeowner');
const googleAPI = require('../../third-parties/google/map-api');
const dbHelper = require('../../helpers/database');

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("Create Home Owner Record", () => {
    let req, res;
    beforeAll(() => {
        jest.clearAllMocks();
        req = { 
            body: { 
                data: {
                    name: "Celine Dion",
                    dob: new Date("1983-10-1"),
                    phone: "548-123-1122",
                    email: "celine.dion@gmail.com",
                    address: "451 Phillip St, Waterloo, ON N2L 3X2",
                    payment: "1200000"
                }
            }
        };
        res = mockResponse();
    });

    it("should return create success message", async () => {
        jest.spyOn(googleAPI, 'getGeoCoordinates').mockResolvedValueOnce({ latitude: 123, longitude: 123 });
        jest.spyOn(dbHelper, 'saveRecord').mockResolvedValueOnce({ 
            name: "Celine Dion",
            dob: new Date("1983-10-1"),
            phone: "548-123-1122",
            email: "celine.dion@gmail.com",
            address: "451 Phillip St, Waterloo, ON N2L 3X2",
            payment: "1200000",
            _id: "1234"
        });
        await homeownerController.create(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    describe("Fail to create record", () => {
        it("should prompt the message which unable to get geo coordinates", async () => {
            jest.spyOn(googleAPI, 'getGeoCoordinates').mockImplementation(() => Promise.reject(new Error('Unable to get geo coordinates as it has multiple returns.')));
            await homeownerController.create(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({"message": "Unable to get geo coordinates as it has multiple returns."});
        });

        it("should prompt the message which unable to save into database", async () => {
            jest.spyOn(googleAPI, 'getGeoCoordinates').mockResolvedValueOnce({ latitude: 123, longitude: 123 });
            jest.spyOn(dbHelper, 'saveRecord').mockImplementation(() => Promise.reject(new Error('Unable to save record.')));
            await homeownerController.create(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({"message": "Unable to save record."});
        });
    });
});

describe("Update Home Owner Record", () => {
    let req, res;
    beforeAll(() => {
        jest.clearAllMocks();
        req = { 
            body: { 
                data: {
                    name: "Celine Dion",
                    dob: new Date("1983-10-1"),
                    phone: "548-123-1122",
                    email: "celine.dion@gmail.com",
                    address: "451 Phillip St, Waterloo, ON N2L 3X2",
                    payment: "1200000"
                }
            }
        };
        res = mockResponse();
    });

    it("should return update success", async () => {
        jest.spyOn(googleAPI, 'getGeoCoordinates').mockResolvedValueOnce({ latitude: 123, longitude: 123 });
        jest.spyOn(dbHelper, 'updateRecord').mockResolvedValueOnce(true);
        await homeownerController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return failure message which unable to update into database", async () => {
        jest.spyOn(googleAPI, 'getGeoCoordinates').mockImplementation(() => Promise.reject(new Error('Unable to get geo coordinates as it has multiple returns.')));
        await homeownerController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({"message": "Unable to get geo coordinates as it has multiple returns."});
    });
});

describe("Read Home Owner Record", () => {
    let req, res;
    beforeAll(() => {
        jest.clearAllMocks();
        res = mockResponse();
    });

    describe("Success to read", () => {
        it("should return target HomeOwner record by using ID", async () => {
            req = { 
                body: { 
                    id: 123456
                }
            };
            jest.spyOn(dbHelper, 'getById').mockResolvedValueOnce(
                { 
                    name: "Celine Dion",
                    age: 30,
                    phone: "548-123-1122",
                    email: "celine.dion@gmail.com",
                    address: "451 Phillip St, Waterloo, ON N2L 3X2",
                    latitude: 123,
                    longitude: 123,
                    payment: "1200000",
                    _id: "1234"
                });
            const ret = await homeownerController.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it("should return target HomeOwner record by using Search Parameter (Name, Phone, or Email)", async () => {
            req = { 
                body: { 
                    data: {
                        name: "Celine Dion",
                        phone: "548-123-1122",
                        email: "celine.dion@gmail.com"
                    }
                }
            };
            jest.spyOn(dbHelper, 'getByParams').mockResolvedValueOnce(
                { 
                    name: "Celine Dion",
                    age: 30,
                    phone: "548-123-1122",
                    email: "celine.dion@gmail.com",
                    address: "451 Phillip St, Waterloo, ON N2L 3X2",
                    latitude: 123,
                    longitude: 123,
                    payment: "1200000",
                    _id: "1234"
                });
            await homeownerController.getBy(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
        
        it("should return all Homeowners' records", async () => {
            req = { 
                body: { 
                    data: []
                }
            };
            jest.spyOn(dbHelper, 'getAllRecords').mockResolvedValueOnce(
                { 
                    name: "Celine Dion",
                    age: 30,
                    phone: "548-123-1122",
                    email: "celine.dion@gmail.com",
                    address: "451 Phillip St, Waterloo, ON N2L 3X2",
                    latitude: 123,
                    longitude: 123,
                    payment: "1200000",
                    _id: "1234"
                });
            await homeownerController.getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    it("should return unable to connect to database message when having failure in getAll()", async () => {
        req = { 
            body: { 
                data: []
            }
        };
        res = mockResponse();
        jest.spyOn(dbHelper, 'getAllRecords').mockImplementation(() => Promise.reject(new Error('Unable to get all records. ')));
        await homeownerController.getAll(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({"message": "Unable to get all records. "});
    });

    it("should return unable to connect to database message when having failure in getByID()", async () => {
        req = { 
            body: { 
                data: []
            }
        };
        res = mockResponse();
        jest.spyOn(dbHelper, 'getById').mockImplementation(() => Promise.reject(new Error('Unable to get all records. ')));
        await homeownerController.getById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({"message": "Unable to get all records. "});
    });

    it("should return unable to connect to database message when having failure in GetBy()", async () => {
        req = { 
            body: { 
                data: []
            }
        };
        res = mockResponse();
        jest.spyOn(dbHelper, 'getByParams').mockImplementation(() => Promise.reject(new Error('Unable to get all records. ')));
        await homeownerController.getBy(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({"message": "Unable to get all records. "});
    });
});

describe("Delete Home Owner Record", () => {
    describe("Success to delete", () => {
        let req, res;
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should success to delete by using ID", async () => {
            req = { 
                body: { 
                    id: 12345
                }
            };
            res = mockResponse();
            jest.spyOn(dbHelper, 'removeRecord').mockResolvedValueOnce(true);
            await homeownerController.remove(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it("should success to delete by using multiple IDs", async () => {
            req = { 
                body: { 
                    ids: [12345, 23456]
                }
            };
            res = mockResponse();
            jest.spyOn(dbHelper, 'removeRecords').mockResolvedValueOnce(true);
            await homeownerController.remove(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    it("should return unable to connect to database message when having failure in remove()", async () => {
        req = { 
            body: { 
                ids: []
            }
        };
        res = mockResponse();
        jest.spyOn(dbHelper, 'removeRecords').mockImplementation(() => Promise.reject(new Error('Unable to remove record, id')));
        await homeownerController.remove(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({"message": "Unable to remove record, id"});
    });
});