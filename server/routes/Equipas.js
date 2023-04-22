const express = require('express')
const router = express.Router()
const { Equipas } = require('../models')

router.get("/", async (req, res) =>{
    const listOfPost = await Equipas.findAll();
    res.json(listOfPost);
});

router.post("/", async (req, res) =>{
    const cc = req.body;
    await Equipas.create(cc);
    res.json(cc);
})

module.exports = router