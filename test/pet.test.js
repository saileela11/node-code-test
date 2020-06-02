const request = require('supertest');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const app = require('../app');
const expect = chai.expect;

chai.use(chaiAsPromised);

describe('functional - pet', () => {
    it('should fail to create a pet without a Name', async () => {
        const res = await request(app).post('/pets').send({
            colour: 'white',
            age: 2
        });
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('"name" is required');
    });
    it('should fail to create a pet without age', async () => {
        const res = await request(app).post('/pets').send({
            colour: 'white',
            name: 'Jim'
        });
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('"age" is required');
    });
    it('should fail to create a pet without colour', async () => {
        const res = await request(app).post('/pets').send({
            name: 'jim',
            age: 2
        });
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('"colour" is required');
    });

    it('should create a pet', async () => {
        const pet = {
            name: 'John',
            age: 2,
            colour: 'white',
        };
        const res = await request(app).post('/pets').send(pet);
        expect(res.status).to.equal(201);
        expect(res.body.name).to.equal(pet.name);
        expect(res.body.age).to.equal(pet.age);
        expect(res.body.colour).to.equal(pet.colour);
    });

    it('Negative test- should fail when an invalid data type is passed in request for creating a pet', async () => {
        const pet = {
            name: 'John',
            age: '2',
            colour: 'white',
        };
        const res = await request(app).post('/pets').send(pet);
        expect(res.status).to.equal(201);
        expect(res.body.name).to.equal(pet.name);
        expect(res.body.age).not.to.equal(pet.age);
        expect(res.body.colour).to.equal(pet.colour);
    });

    it('should display all pets', async () => {
        const res = await request(app).get('/pets/').send();
        expect(res.status).to.equal(200);
    });

    it('should display the pet selected', async () => {
        const pet = {
            name: 'John',
            age: 2,
            colour: 'white',
        };
        const res = await request(app).post('/pets').send(pet);
        expect(res.status).to.equal(201);
        expect(res.body.name).to.equal(pet.name);
        const petNameRes = await request(app).get('/pets/pet?name=' + pet.name).send();
        expect(petNameRes.status).to.equal(200);

    });
    it('Negative test- should fail when trying to search for a pet with out passing anything', async () => {
        const petNameRes = await request(app).get('/pets/pet?name=').send();
        expect(petNameRes.status).to.equal(400);

    });

    it('should delete the pet selected', async () => {
        const pet = {
            name: 'John',
            age: 2,
            colour: 'white',
        };
        const res = await request(app).post('/pets').send(pet);
        expect(res.status).to.equal(201);
        expect(res.body.name).to.equal(pet.name);
        const petDeleteRes = await request(app).
        post('/pets/delete/').send({ _id: res.body._id });
        expect(petDeleteRes.status).to.equal(201);
    });

    it('Negative test- should fail when trying to delete the pet with out passing a valid pet id', async () => {
        const petDeleteRes = await request(app).post('/pets/delete/').send({ _id: '' });
        expect(petDeleteRes.status).to.equal(400);


    });
});