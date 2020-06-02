const express = require('express');
const Joi = require('@hapi/joi');

const Pets = require('../models/pets');
const { validateBody, validateQuery } = require('../middlewares/route');

const router = express.Router();
//post api to create a pet
router.post("/", validateBody(Joi.object().keys({
  name: Joi.string().required().description('Pet name'),
  colour: Joi.string().required().description('Pet colour'),
  age: Joi.number().integer().required().description('Pet age'),
}),
  {
    stripUnknown: true,
  }),
  async (req, res, next) => {
    try {
      const pet = new Pets(req.body);
      await pet.save();
      res.status(201).json(pet);
    } catch (e) {
      next(e);
    }
  }
);
//get api to get all pets
router.get('/', async (req, res, next) => {
  try {
    const pets = await Pets.find().exec();
    res.status(200).json(pets);
  }
  catch (e) {
    next(e);
  }
});

//get api to get one selected pet
router.get("/pet",
  validateQuery(Joi.object().keys({
    name: Joi.string().required().description('Pet name'),
  }),
    {
      stripUnknown: true,
    }),
  async (req, res, next) => {
    try {
      const petName = req.query.name;
      const pets = await Pets.find({ name: petName }).exec();
      res.status(200).json(pets);
    } catch (exception) {
      next(exception);
    }
  });

// Post API to delete pets 
router.post("/delete",
  validateBody(Joi.object().keys({
    _id: Joi.string().required().description('Pet id')
  }),
    {
      stripUnknown: true,
    }), async (req, res, next) => {
      try {
        const petId = req.body._id;
        const pets = await Pets.deleteOne({ _id: petId });
        pets.deletedCount && res.status(201).json("Pet deleted");
      } catch (exception) {
        next(exception);
      }
    });
module.exports = router;