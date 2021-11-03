const request = require('supertest');
let server;

describe('/api/homeowner', () => {
    beforeEach(() => { server = require('../../start'); });
    afterEach(() => { server.close(); });

    const data = [{
        name: 'Celine Dion',
        dob: '1988-12-26',
        phone: '548-123-1122',
        email: 'celine.dion@gmail.com',
        address: '451 Phillip St, Waterloo, ON N2L 3X2',
        payment: 500000
    },
    {
        name: 'Deline Lion',
        dob: '1986-12-27',
        phone: '548-111-1122',
        email: 'deline.lion@gmail.com',
        address: '111 Phillip St, Waterloo, ON N2L 3X2',
        payment: 1000000
    }]
    const geoCoordinates = [{
        latitude : 43.48246719999999,
        longitude : -80.54332409999999
    },
    {
        latitude: 43.47667939999999,
        longitude: -80.5399357,
    }];

    const xml = ['<?xml version="1.0" encoding="UTF-8" ?>' + 
                    '<homeowner>' + 
                        '<name>' + data[0].name + '</name>' + 
                        '<dob>' + data[0].dob + '</dob>' + 
                        '<phone>' + data[0].phone + '</phone>' + 
                        '<email>' + data[0].email + '</email>' + 
                        '<address>' + data[0].address + '</address>' + 
                        '<payment>' + data[0].payment + '</payment>' + 
                    '</homeowner>',
                    '<?xml version="1.0" encoding="UTF-8" ?>' + 
                    '<homeowner>' + 
                        '<name>' + data[1].name + '</name>' + 
                        '<dob>' + data[1].dob + '</dob>' + 
                        '<phone>' + data[1].phone + '</phone>' + 
                        '<email>' + data[1].email + '</email>' + 
                        '<address>' + data[1].address + '</address>' + 
                        '<payment>' + data[1].payment + '</payment>' + 
                    '</homeowner>']

    describe('POST /', () => {
        it('should return 201 with create homeowner', async () => {
            const ret = await request(server)
                                .post('/api/homeowner')
                                .send('xml=' + xml[0])
            const homeowner = ret.body;
            const age = Math.abs(new Date(Date.now() - new Date(data[0].dob))
                                        .getUTCFullYear() - 1970);
            let id = homeowner._id;
            expect(ret.status).toBe(201);
            expect(homeowner.name).toBe(data[0].name);
            expect(homeowner.age).toBe(age);
            expect(homeowner.phone).toBe(data[0].phone);
            expect(homeowner.email).toBe(data[0].email);
            expect(homeowner.address).toBe(data[0].address);
            expect(homeowner.payment).toBe(data[0].payment);
            expect(homeowner.latitude).toBe(geoCoordinates[0].latitude);
            expect(homeowner.longitude).toBe(geoCoordinates[0].longitude);

            // clean database record
            await request(server).delete('/api/homeowner').send('id=' + id);
        });

        it('should return 422 when it is invalid xml input', async () => {
            const ret = await request(server)
                                .post('/api/homeowner');
            expect(ret.status).toBe(422);
            expect(ret.body.errors.errors[0].msg).toBe('xml cannot be empty');
            expect(ret.body.errors.errors[0].param).toBe('xml');
        });

        it('should return 422 when it fails xml validation', async () => {
            const ret = await request(server)
                                .post('/api/homeowner')
                                .send('xml=d');
            expect(ret.status).toBe(422);
            expect(ret.body).toBe('char \'d\' is not expected.');
        });

        it('should return 422 when <Homeowner> tag not found', async () => {
            const ret = await request(server)
                                .post('/api/homeowner')
                                .send('xml=<?xml version="1.0" encoding="UTF-8" ?><test></test>');
            expect(ret.status).toBe(422);
            expect(ret.body).toBe('Unable to find tag <Homeowner>');
        });
    });

    describe('PUT /', () => {
        let orginal_email = data[0].email;
        it('should return 200 if update success', async () => {
            // Prepare Data
            let ret = await request(server)
                            .post('/api/homeowner')
                            .send('xml=' + xml[0])
            let id = ret.body._id;
            expect(id).not.toBeNull();

            data.email = 'deline.lion@gmail.com';
            ret = await request(server)
                            .put('/api/homeowner')
                            .send('id=' + id + '&xml=' + xml[0] + '');
            const homeowner = ret.body;
            expect(homeowner.message).toBe('Update Record Success');

            // clean database record
            await request(server).delete('/api/homeowner').send('id=' + id);
            data.email = orginal_email;
        });

        it('should return 422 when it is invalid xml input', async () => {
            const ret = await request(server)
                                .put('/api/homeowner');
            expect(ret.status).toBe(422);
            expect(ret.body.errors.errors[0].msg).toBe('The value should not be empty');
            expect(ret.body.errors.errors[0].param).toBe('id');
            expect(ret.body.errors.errors[1].msg).toBe('xml cannot be empty');
            expect(ret.body.errors.errors[1].param).toBe('xml');
        });

        it('should return 422 when it fails xml validation', async () => {
            const ret = await request(server)
                                .put('/api/homeowner')
                                .send('id=1&xml=d');
            expect(ret.status).toBe(422);
            expect(ret.body).toBe('char \'d\' is not expected.');
        });

        it('should return 422 when <Homeowner> tag not found', async () => {
            const ret = await request(server)
                                .put('/api/homeowner')
                                .send('id=1&xml=<?xml version="1.0" encoding="UTF-8" ?><test></test>');
            expect(ret.status).toBe(422);
            expect(ret.body).toBe('Unable to find tag <Homeowner>');
        });
    });

    describe('GET /search', () => {
        it('should return 200 and return homeowners', async () => {
            let ids = [];
            // Prepare Data
            let ret = await request(server)
                            .post('/api/homeowner')
                            .send('xml=' + xml[0]);
            ids.push(ret.body._id);
            ret = await request(server)
                            .post('/api/homeowner')
                            .send('xml=' + xml[1]);
            ids.push(ret.body._id);    

            ret = await request(server)
                            .get('/api/homeowner/search')
                            .send('name=' + data[0].name + '&phone' + data[0].phone + '&email=' + data[0].email);
            
            const homeowners = ret.body;
            const age = Math.abs(new Date(Date.now() - new Date(data[0].dob))
                                        .getUTCFullYear() - 1970);

            expect(homeowners.length).toBe(1);
            expect(homeowners[0].name).toBe(data[0].name);
            expect(homeowners[0].age).toBe(age);
            expect(homeowners[0].phone).toBe(data[0].phone);
            expect(homeowners[0].email).toBe(data[0].email);
            expect(homeowners[0].address).toBe(data[0].address);
            expect(homeowners[0].payment).toBe(data[0].payment);
            expect(homeowners[0].latitude).toBe(geoCoordinates[0].latitude);
            expect(homeowners[0].longitude).toBe(geoCoordinates[0].longitude);

            // clean database record
            for(id of ids){
                await request(server).delete('/api/homeowner').send('id=' + id);
            }
        });
    });

    describe('GET /all', () => {
        it('should return 200 and return homeowners', async () => {
            let ids = [];
            // Prepare Data
            let ret = await request(server)
                            .post('/api/homeowner')
                            .send('xml=' + xml[0]);
            ids.push(ret.body._id);
            ret = await request(server)
                            .post('/api/homeowner')
                            .send('xml=' + xml[1]);
            ids.push(ret.body._id);

            ret = await request(server)
                            .get('/api/homeowner/all');
            
            const homeowners = ret.body;
            const age1 = Math.abs(new Date(Date.now() - new Date(data[0].dob))
                                        .getUTCFullYear() - 1970);
            const age2 = Math.abs(new Date(Date.now() - new Date(data[1].dob))
                                        .getUTCFullYear() - 1970);

            expect(homeowners.length).toBe(data.length);
            expect(homeowners[0].name).toBe(data[0].name);
            expect(homeowners[0].age).toBe(age1);
            expect(homeowners[0].phone).toBe(data[0].phone);
            expect(homeowners[0].email).toBe(data[0].email);
            expect(homeowners[0].address).toBe(data[0].address);
            expect(homeowners[0].payment).toBe(data[0].payment);
            expect(homeowners[0].latitude).toBe(geoCoordinates[0].latitude);
            expect(homeowners[0].longitude).toBe(geoCoordinates[0].longitude);
            expect(homeowners[1].name).toBe(data[1].name);
            expect(homeowners[1].age).toBe(age2);
            expect(homeowners[1].phone).toBe(data[1].phone);
            expect(homeowners[1].email).toBe(data[1].email);
            expect(homeowners[1].address).toBe(data[1].address);
            expect(homeowners[1].payment).toBe(data[1].payment);
            expect(homeowners[1].latitude).toBe(geoCoordinates[1].latitude);
            expect(homeowners[1].longitude).toBe(geoCoordinates[1].longitude);

            // clean database record
            for(id of ids){
                await request(server).delete('/api/homeowner').send('id=' + id);
            }
        });
    });

    describe('GET /id', () => {
        it('should return 200 and return target homeowner', async () => {
            let ids = [];
            // Prepare Data
            let ret = await request(server)
                            .post('/api/homeowner')
                            .send('xml=' + xml[0]);
            ids.push(ret.body._id);
            ret = await request(server)
                            .post('/api/homeowner')
                            .send('xml=' + xml[1]);
            ids.push(ret.body._id);

            ret = await request(server)
                        .get('/api/homeowner/id')
                        .send('id=' + ids[0]);

            const age = Math.abs(new Date(Date.now() - new Date(data[0].dob))
                            .getUTCFullYear() - 1970);
            const homeowner = ret.body;
            expect(homeowner.name).toBe(data[0].name);
            expect(homeowner.age).toBe(age);
            expect(homeowner.phone).toBe(data[0].phone);
            expect(homeowner.email).toBe(data[0].email);
            expect(homeowner.address).toBe(data[0].address);
            expect(homeowner.payment).toBe(data[0].payment);
            expect(homeowner.latitude).toBe(geoCoordinates[0].latitude);
            expect(homeowner.longitude).toBe(geoCoordinates[0].longitude);

            // clean database record
            for(id of ids){
                await request(server).delete('/api/homeowner').send('id=' + id);
            }
        });

        it('should return 422 when it is invalid input', async () => {
            const ret = await request(server)
                                .get('/api/homeowner/id');
            expect(ret.status).toBe(422);
            expect(ret.body.errors.errors[0].msg).toBe('The value should not be empty');
            expect(ret.body.errors.errors[0].param).toBe('id');
        });
    });

    describe('DELETE /', () => {
        it('should return 200 and return success message - remove Id', async () => {
            // Prepare Data
            let ret = await request(server)
                                .post('/api/homeowner')
                                .send('xml=' + xml[0])
            const homeowner = ret.body;
            let id = homeowner._id;
            
            ret = await request(server)
                                .delete('/api/homeowner')
                                .send('id=' + id);
            expect(ret.status).toBe(200);
            expect(ret.body.message).toBe('Remove Record(s) Success');

            // clean database record
            await request(server).delete('/api/homeowner').send('id=' + id);
        });

        it('should return 200 and return success message - remove Ids', async () => {
            let ids = [];
            // Prepare Data
            let ret = await request(server)
                            .post('/api/homeowner')
                            .send('xml=' + xml[0]);
            ids.push(ret.body._id);
            ret = await request(server)
                            .post('/api/homeowner')
                            .send('xml=' + xml[1]);
            ids.push(ret.body._id);
            
            ret = await request(server)
                                .delete('/api/homeowner')
                                .send('ids[0]=' + ids[0] + '&ids[1]=' + ids[1]);
            expect(ret.status).toBe(200);
            expect(ret.body.message).toBe('Remove Record(s) Success');

            // clean database record
            for(id of ids){
                await request(server).delete('/api/homeowner').send('id=' + id);
            }
        });
    });
});