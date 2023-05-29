const express = require('express');
const router = express.Router();
const {JogoType} = require('../models');

router.get("/", async (req, res) =>{
    const listOfJogoType = await JogoType.findAll();
    res.json(listOfJogoType);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await JogoType.create(cc);
    res.json(cc);
})

module.exports = router